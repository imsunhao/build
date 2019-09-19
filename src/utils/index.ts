import { resolve } from 'path'
import { ConfigOptions, BuildService } from '@types'

import { getClientConfig, getServerConfig, getClientConfigSync } from 'src.config'
import { existsSync, readFileSync } from 'fs'
import consola from 'consola'
import { createResolve } from 'src/utils/path'
import rimraf from 'rimraf'

import http from 'http'
import express, { Express, Router } from 'express'
import compression from 'compression'
import proxyMiddleware from 'http-proxy-middleware'
import LRU from 'lru-cache'
import { compilerConfig, compilerDll, compilerConfigSync } from 'src/utils/compiler.webpack'

/**
 * 获取 根目录 地址
 * @param argv BuildService 通用 启动参数
 */
function getRootDir(argv: BuildService.parsedArgs) {
  return resolve(argv._[0] || '.')
}

/**
 * 获取 配置文件 设置
 * @param argv BuildService 通用 启动参数
 * @param mode webpack 环境
 */
function getConfigFileOptions(
  argv: BuildService.parsedArgs
): BuildService.parsedArgs.config {
  const rootDir = getRootDir(argv)
  if (argv['config-file']) {
    const configFile = resolve(rootDir, argv['config-file'])
    if (!existsSync(configFile)) {
      consola.fatal('entry is not exists', configFile)
      return process.exit(1)
    }

    let options: any = {}

    try {
      const jsonString = readFileSync(configFile, { encoding: 'utf-8' })
      options = JSON.parse(jsonString)
    } catch (error) {
      consola.fatal(error)
      return process.exit(1)
    }

    const { entry, output, injectContext } = options

    return {
      entry: resolve(rootDir, argv.entry || entry),
      output: resolve(rootDir, argv.output || output),
      injectContext: resolve(rootDir, argv.injectContext || injectContext)
    }
  } else {
    return {
      entry: resolve(rootDir, argv.entry || './build.config.ts'),
      output: resolve(rootDir, argv.output || './dist/build'),
      injectContext: resolve(rootDir, argv.injectContext || '')
    }
  }
}

function getDefaultStaticFileExts() {
  return ['.ico', '.png', '.jpg', '.js', '.css', '.json', '.mp4']
}

let buildServiceConfig: ConfigOptions.options

/**
 * 设置 Babelrc
 * @param options build 通用 webpack 配置
 */
export function setBabelrc(options: ConfigOptions.options) {
  const babelPlugins = [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: false
      }
    ],
    '@babel/plugin-syntax-flow',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-flow-strip-types',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ]
  ]
  if (!options.babelrc) {
    options.babelrc = {}
  }
  if (!options.babelrc.plugins) {
    options.babelrc.plugins = babelPlugins
  } else {
    options.babelrc.plugins = options.babelrc.plugins.concat(babelPlugins)
  }
  return options
}

/**
 * 设置 版本号
 * @param options build 通用 webpack 配置
 */
export function setVersion(options: ConfigOptions.options) {
  if (options.version) return options
  try {
    const PACKAGE = JSON.parse(
      readFileSync(resolve(options.rootDir || '', 'package.json'), {
        encoding: 'utf-8'
      })
    )
    options.version = PACKAGE.version
    return options
  } catch (error) {
    consola.fatal('setVersion', error)
    return process.exit(1)
  }
}

function baseSetWebpack(
  options: ConfigOptions.options
) {
  options.webpack.server = getServerConfig(options)
  // const isProduction = mode ? mode !== 'development' : true
  // if (!isProduction) {
  // }
  const rootDirLength = options.rootDir ? options.rootDir.length : 0
  let path = (options.webpack.client as any).output.path
  if (path[path.length - 1] !== '/') {
    path += '/'
  }
  path = path.slice(rootDirLength)
  process.env.PUBLIC_PATH = path
  return options
}

/**
 * 设置 webpack
 * @param options build 通用 webpack 配置
 * @param mode webpack 环境
 */
async function setWebpack(
  options: ConfigOptions.options,
  mode: ConfigOptions.webpackMode
) {
  options.webpack = options.webpack || {}
  options.webpack.mode = mode
  options.webpack.client = await getClientConfig(options)
  baseSetWebpack(options)
  return options
}

/**
 * 同步 设置 webpack
 * @param options build 通用 webpack 配置
 * @param mode webpack 环境
 */
export function setWebpackSync(
  options: ConfigOptions.options,
  mode: ConfigOptions.webpackMode
) {
  options.webpack.mode = mode
  options.webpack.client = getClientConfigSync(options)
  baseSetWebpack(options)
  return options
}

/**
 * 通过 用户的设定 完善 argv参数
 * @param options build 通用 webpack 配置
 * @param argv BuildService 通用 启动参数
 */
function completeArgvByUserConfig(
  argv: BuildService.parsedArgs,
  options: ConfigOptions.options
) {
  if (!argv.port) argv.port = options.port
  if (!argv.fileDescriptor) argv.fileDescriptor = options.fileDescriptor
  return argv
}
/**
 * 设置 静态文件后缀
 * @param options build 通用 webpack 配置
 */
export function setStaticFileExts(options: ConfigOptions.options) {
  if (!options.staticFileExts || options.staticFileExts.constructor !== Array) {
    options.staticFileExts = []
  }
  options.staticFileExts = options.staticFileExts.concat(
    getDefaultStaticFileExts()
  )
  return options
}

/**
 * 设置 注入的上下文
 * @param configOptions 配置文件 设置
 */
function getInjectContext(configOptions: BuildService.parsedArgs.config) {
  const injectContext: any = {}

  if (existsSync(configOptions.injectContext || '')) {
    try {
      const jsonString = readFileSync(configOptions.injectContext, {
        encoding: 'utf-8'
      })
      Object.assign(injectContext, JSON.parse(jsonString))
    } catch (error) {
      consola.fatal(error)
      return process.exit(1)
    }
  }
  return injectContext
}

export function getUserConfigSync(
  mode: ConfigOptions.webpackMode,
  argv: BuildService.parsedArgs
): ConfigOptions.options {
  const configOptions = getConfigFileOptions(argv)
  const injectContext = getInjectContext(configOptions)
  const rootDir = getRootDir(argv)

  let options: any

  if (existsSync(configOptions.entry || '')) {
    options = compilerConfigSync(configOptions, mode)
    if (!options) {
      options = {}
    } else {
      const args: ConfigOptions.getOptionsInject = {
        argv,
        mode,
        resolve: createResolve(rootDir),
        injectContext
      }
      options = options.default(args)
      options.rootDir = options.rootDir || rootDir
    }
    if (options.default) {
      options = options.default
    }
  } else if (argv['config-file'] !== 'buildService.config.js') {
    consola.fatal('Could not load config file: ' + argv['config-file'])
    return process.exit(1)
  }

  if (!options.injectContext) {
    options.injectContext = injectContext
  } else {
    options.injectContext = {
      ...injectContext,
      ...options.injectContext
    }
  }

  return options
}

/**
 * 获取 用户配置
 * @param configOptions 配置文件 设置
 * @param injectContext 注入的上下文
 * @param argv BuildService 通用 启动参数
 * @param mode webpack 启动模式
 */
async function getUserConfig(
  configOptions: BuildService.parsedArgs.config,
  injectContext: any,
  mode: ConfigOptions.webpackMode,
  argv: BuildService.parsedArgs
) {
  const rootDir = getRootDir(argv)
  let options: any

  if (existsSync(configOptions.entry || '')) {
    options = await compilerConfig(configOptions, mode, { rootDir })
    if (!options) {
      options = {}
    } else {
      const args: ConfigOptions.getOptionsInject = {
        argv,
        mode,
        resolve: createResolve(rootDir),
        injectContext
      }
      options = options.default(args)
      options.rootDir = options.rootDir || rootDir
    }
    if (options.default) {
      options = options.default
    }
  } else if (argv['config-file'] !== 'buildService.config.js') {
    consola.fatal('Could not load config file: ' + argv['config-file'])
    return process.exit(1)
  }

  if (!options.injectContext) {
    options.injectContext = injectContext
  } else {
    options.injectContext = {
      ...injectContext,
      ...options.injectContext
    }
  }

  return options
}

/**
 * 初始化并获取 BuildService 配置
 * @param argv BuildService 通用 启动参数
 * @param mode webpack 启动模式
 */
export async function initConfig(
  argv: BuildService.parsedArgs,
  mode: ConfigOptions.webpackMode,
  opt?: ConfigOptions.options.initConfigOptions
): Promise<ConfigOptions.options> {
  const configOptions = getConfigFileOptions(argv)

  if (opt && opt.clear) {
    if (configOptions && configOptions.output) {
      rimraf.sync(configOptions.output)
    }
  }

  const injectContext = getInjectContext(configOptions)

  const options: ConfigOptions.options = await getUserConfig(
    configOptions,
    injectContext,
    mode,
    argv
  )

  setStaticFileExts(options)

  setBabelrc(options)

  await checkDll(argv, options)

  await setWebpack(options, mode)

  options.buildVersion = argv.version

  setVersion(options)

  setBuildServiceConfig(options)

  argv = completeArgvByUserConfig(argv, options)

  return options
}

/**
 * 检测 是否启用 dll 启动
 *  * **必须** 放置在 **setWebpack** 设置webpack **之前**
 * @param argv BuildService 通用 启动参数
 * @param options build 通用 webpack 配置
 */
async function checkDll(
  argv: BuildService.parsedArgs,
  options: ConfigOptions.options
) {
  if (argv.dll) {
    if (!(options.webpack && options.webpack.dll)) {
      consola.fatal('options.webpack.dll is undefined')
      return process.exit(1)
    }

    await compilerDll(options)

    return process.exit(0)
  }
}

/**
 * 获取 BuildService 配置
 */
export function getConfig(config?: any): ConfigOptions.options {
  if (!config && !buildServiceConfig) {
    consola.error('getConfig', 'config not init')
    return process.exit(1)
  }
  return config || buildServiceConfig
}

export function setBuildServiceConfig(config: ConfigOptions.options) {
  if (buildServiceConfig) {
    consola.error('[setBuildServiceConfig]', 'config has init')
    return process.exit(1)
  }
  buildServiceConfig = config
}

/**
 * 初始化 服务器
 * @return express实例: app
 */
export function serverInit() {
  const { env, statics, proxyTable, injectContext, webpack } = getConfig()
  const app = express()

  app.use(compression({ threshold: 0 }))

  serverStatics(app, statics)

  serverProxy(app, proxyTable)

  serverRenderDefaultEnv(app, env, webpack)

  setInjectContext(injectContext)

  return app
}

/**
 * 服务器启动
 * @param app Express 实例
 * @param param1 服务器启动参数
 */
export function serverStart(
  app: Express,
  { port, fileDescriptor }: BuildService.parsedArgs
) {
  let options: any
  if (fileDescriptor) {
    const fd = parseInt(fileDescriptor, 10)

    options = {
      fd
    }
  } else {
    options = port || 8020
  }

  const WAIT_TIME = 1000
  const MAX = 60
  let index = 0

  const server = http.createServer(app)
  server.on('error', function(error) {
    if (index++ < MAX) {
      consola.fatal(
        'SERVER_START:',
        error.message,
        `\n\t重试中, 当前次数: ${index}`
      )
      setTimeout(() => {
        start()
      }, WAIT_TIME)
    } else {
      process.exit(1)
    }
  })
  server.on('listening', function() {
    consola.info(`server started at ${JSON.stringify(options, null, 2)}`)
  })

  start()

  function start() {
    server.listen(options)
  }
}

/**
 * 服务器 静态文件服务
 * @param app Express 实例
 * @param statics 静态文件配置集合
 */
function serverStatics(app: Express, statics?: BuildService.statics) {
  if (!statics) return

  Object.keys(statics).forEach(eStaticKey => {
    const eStatic = statics[eStaticKey]
    consola.info('serverStatics', eStaticKey, eStatic.path, eStatic.maxAge)
    app.use(
      eStaticKey,
      express.static(eStatic.path, {
        maxAge: eStatic.maxAge || 0
      })
    )
  })
}

/**
 * 服务器 接口转发服务
 * @param app Express 实例
 * @param proxyTable 转发列表集合
 */
function serverProxy(app: Express, proxyTable?: BuildService.proxyTable) {
  if (!proxyTable) return
  // proxy api requests
  Object.keys(proxyTable).forEach(function(proxyKey) {
    let options = proxyTable[proxyKey]
    if (typeof options === 'string') {
      options = { target: options }
    }
    app.use(proxyMiddleware(proxyKey, options))
  })
}

/**
 * 服务器 获取 渲染默认 Env
 * @param app Express 实例
 * @param env 转发列表集合
 * @param webpack webpack设置
 */
function serverRenderDefaultEnv(
  app: Express,
  env: any = [],
  webpack: ConfigOptions.options.webpack = {}
) {
  // const isProduction = webpack.mode ? webpack.mode !== 'development' : true
  const defaultEnv = ['VUE_ENV', 'PUBLIC_PATH', 'PACKAGE_VERSION']
  process.env.PACKAGE_VERSION = getConfig().version
  env = env.concat(defaultEnv)
  consola.info('serverRenderDefaultEnv', env)
  app.use(function(req: BuildService.Request, res, next) {
    const renderEnv = req.renderEnv || []
    req.renderEnv = env.concat(renderEnv)
    next()
  })
}

/**
 * 设置 服务器端 注入的上下文 __INJECT_CONTEXT__
 * @param injectContext 注入的上下文
 */
function setInjectContext(injectContext: any = {}) {
  ;(process as any).__INJECT_CONTEXT__ = injectContext
}

/**
 * 基础 渲染 配置
 */
export const BASE_RENDER_OPTIONS = {
  // for component caching
  cache: LRU({
    max: 1000,
    maxAge: 1000 * 60 * 15
  }),
  // this is only needed when vue-server-renderer is npm-linked
  // basedir: resolve(config.assetRoot),
  // recommended for performance
  runInNewContext: 'once',
  inject: true
}

const isProduction = process.env.NODE_ENV === 'production'

// server render会忽略下面的路径
const routerExtensionPath = ['private']

const routerExtensionRegList: RegExp[] = []
routerExtensionPath.forEach(path => {
  routerExtensionRegList.push(new RegExp(`^/${path}/`))
})

export function isRouterExtensionPath(path: string) {
  for (const reg of routerExtensionRegList) {
    if (reg.test(path)) return true
  }
  return false
}

/**
 * Express 路由 栈管理中心
 */
export class RouterStackManagement {
  private enabled = false

  private startIndex = 0
  private hotUpDateCount = 0

  app?: Express
  router?: Router

  private store: any[] = []

  init(app: Express) {
    if (this.enabled) return
    this.enabled = true
    this.app = app
    this.router = app._router
    this.startIndex = this.stack.length - 1
    consola.info(
      `RouterStackManagement 已经初始化完成 当前 startIndex = ${this.startIndex}`
    )
  }

  get endIndex() {
    const { startIndex, store } = this
    return startIndex + store.length
  }

  get stack() {
    return this.router ? this.router.stack : []
  }

  set stack(stack) {
    if (!this.router) return
    this.router.stack = stack
  }

  private use({
    index,
    middleware: { path, methods, handle }
  }: {
    index: number
    middleware: { path: string; methods: any; handle: any }
  }) {
    const { app, store, stack, endIndex } = this
    if (!app) return
    const current = store[index]
    ;(app as any)[methods.toLocaleLowerCase()](path, handle)
    if (!current) {
      if (endIndex + 1 !== stack.length) {
        stack.splice(endIndex, 0, stack.pop())
      }
      store[index] = {
        index: endIndex,
        hotUpDateCount: 1
      }
      consola.info(`stack Index = ${index} 已经初始化完成`)
    } else {
      stack.splice(current.index, 1, stack.pop())
      current.hotUpDateCount++
      consola.info(
        `stack Index = ${index} currentIndex = ${current.index} 已经更新, 当前更新次数 = ${current.hotUpDateCount}`
      )
    }
  }

  /**
   * 热更新 中间件
   * @param middlewares 中间件
   */
  protected update(middlewares: any[]) {
    if (isProduction) {
      return middlewares.forEach(({ path, methods, handle }) => {
        ;(this.app as any)[methods.toLocaleLowerCase()](path, handle)
      })
    }
    if (!this.enabled) return
    const { store, stack, endIndex } = this
    this.hotUpDateCount++
    middlewares.forEach((middleware, index) => {
      this.use({
        index,
        middleware
      })
    })
    consola.info(
      `RouterStackManagement 已经更新, 当前总更新次数 = ${this.hotUpDateCount}`
    )
    if (middlewares.length !== store.length) {
      const deleteCount = store.length - middlewares.length
      const deleteIndex = endIndex - deleteCount
      stack.splice(deleteIndex, deleteCount)
      store.length -= deleteCount
      consola.info('已删除 多余 中间件')
    }
  }
}

/**
 * Express 路由 栈管理中心 实例
 */
export const routerStackManagement = new RouterStackManagement()
