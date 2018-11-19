import { resolve } from 'path'
import { ConfigOptions, BuildService } from '@types'

import { getClientConfig, getServerConfig } from 'src/config'
import { existsSync } from 'fs'
import consola from 'consola'
import { createResolve } from 'src/utils/path'
import rimraf from 'rimraf'

import express, { Express } from 'express'
import compression from 'compression'
import proxyMiddleware from 'http-proxy-middleware'
import LRU from 'lru-cache'
import { compilerConfig, compilerDll } from 'src/utils/compiler.webpack'

/**
 * 获取 根目录 地址
 * @param argv BuildService 通用 启动参数
 */
function getRootDir(argv: BuildService.parsedArgs) {
  return resolve(argv._[0] || '.')
}

/**
 * 获取 配置目录 地址
 * @param argv BuildService 通用 启动参数
 */
function getConfigFile(argv: BuildService.parsedArgs) {
  return resolve(getRootDir(argv), argv['config-file'])
}

function getDefaultStaticFileExts() {
  return ['.ico', '.png', '.jpg', '.js', '.css', '.json']
}

let buildServiceConfig: ConfigOptions.options

/**
 * 设置 Babelrc
 * @param configFile build 通用 webpack 配置
 */
function setBabelrc(options: ConfigOptions.options) {
  const babelPlugins = [
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
 * 设置 webpack
 * @param configFile build 通用 webpack 配置
 * @param mode webpack 环境
 */
async function setWebpack(
  options: ConfigOptions.options,
  mode: ConfigOptions.webpackMode
) {
  options.webpack = options.webpack || {}
  options.webpack.mode = mode
  options.webpack.client = await getClientConfig(options)
  options.webpack.server = getServerConfig(options)
  return options
}
/**
 * 设置 静态文件后缀
 * @param configFile build 通用 webpack 配置
 */
function setStaticFileExts(options: ConfigOptions.options) {
  if (!options.staticFileExts || options.staticFileExts.constructor !== Array) {
    options.staticFileExts = []
  }
  options.staticFileExts = options.staticFileExts.concat(
    getDefaultStaticFileExts()
  )
  return options
}

/**
 * 初始化并获取 BuildService 配置
 * @param argv BuildService 通用 启动参数
 */
export async function initConfig(
  argv: BuildService.parsedArgs,
  mode: ConfigOptions.webpackMode,
  opt?: ConfigOptions.options.initConfigOptions
): Promise<ConfigOptions.options> {
  const rootDir = getRootDir(argv)
  const configFile = getConfigFile(argv)

  let options: any = {}

  if (existsSync(configFile)) {
    options = await compilerConfig(configFile)
    if (!options) {
      options = {}
    } else {
      const args: ConfigOptions.getOptionsInject = {
        argv,
        mode,
        resolve: createResolve(rootDir)
      }
      options = options.default(args)
    }
    if (options.default) {
      options = options.default
    }
  } else if (argv['config-file'] !== 'buildService.config.js') {
    consola.fatal('Could not load config file: ' + argv['config-file'])
  }

  if (typeof options.rootDir !== 'string') {
    options.rootDir = rootDir
  }

  if (opt && opt.clear) {
    if (options.webpack && options.webpack.base && options.webpack.base.output) {
      rimraf.sync(options.webpack.base.output.path || '')
    } else {
      consola.fatal('options.webpack.base.output is undefined!')
      return process.exit(0)
    }
  }

  options = setStaticFileExts(options)

  options = setBabelrc(options)

  await checkDll(argv, options)

  options = await setWebpack(options, mode)

  options.version = argv.version

  buildServiceConfig = options

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
      return process.exit(0)
    }

    await compilerDll(options)

    return process.exit(0)
  }
}

/**
 * 获取 BuildService 配置
 */
export function getConfig() {
  if (!buildServiceConfig) {
    consola.error('getConfig', 'config not init')
  }
  return buildServiceConfig
}

/**
 * 初始化 服务器
 * @param {*} BuildService.serverInitOptions
 * @return express实例: app
 */
export function serverInit({
  statics,
  proxyTable
}: BuildService.serverInitOptions) {
  const app = express()

  app.use(compression({ threshold: 0 }))

  serverStatics(app, statics)

  serverProxy(app, proxyTable)

  return app
}

/**
 * 服务器启动
 * @param app Express 实例
 * @param param1 服务器启动参数
 */
export function serverStart(app: Express, { port } = { port: 8080 }) {
  app.listen(port, () => {
    console.log(`server started at localhost:${port}`)
  })
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
  runInNewContext: 'once'
}
