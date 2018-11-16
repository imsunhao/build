import { resolve } from 'path'
import { ConfigOptions, BuildService } from '@types'

import { getClientConfig, getServerConfig } from 'src/config'
import { existsSync } from 'fs'
import consola from 'consola'
import webpack, { Configuration } from 'webpack'
import webpackConfig from 'config/webpack.config'
import MFS from 'memory-fs'
import compile from 'eval'

import express, { Express } from 'express'
import compression from 'compression'
import proxyMiddleware from 'http-proxy-middleware'
import LRU from 'lru-cache'

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
 * 编译 配置文件
 * @param configFile 配置文件路径
 */
function compilerConfig(configFile: string): Promise<() => Configuration> {
  return new Promise(function(done) {
    webpackConfig.entry = {
      config: configFile
    }

    const outputPath = '/cache'

    if (webpackConfig.output) {
      webpackConfig.output.path = outputPath
    } else {
      consola.error('webpackConfig.output is undefined!')
      return {}
    }

    const configCompiler = webpack(webpackConfig)
    const memoryFs = new MFS()
    configCompiler.outputFileSystem = memoryFs
    configCompiler.plugin('done', stats => {
      stats = stats.toJson()
      stats.errors.forEach((err: any) => consola.error(err))
      stats.warnings.forEach((err: any) => consola.info(err))
      if (stats.errors.length) return

      let config: any = {}
      try {
        config = memoryFs.readFileSync(
          resolve(outputPath, 'config.js'),
          'utf-8'
        )
        config = compile(config)
      } catch (e) {
        consola.error(e)
      } finally {
        done(config)
      }
    })
    configCompiler.run((err, stats) => {})
  })
}

/**
 * 设置 Babelrc
 * @param configFile build 通用 webpack 配置
 */
function setBabelrc (options: ConfigOptions.options) {
  if (!options.babelrc) {
    options.babelrc = {}
  }
  if (!options.babelrc.plugins) {
    options.babelrc.plugins = []
  }
  options.babelrc.plugins.concat([
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-decorators',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-flow',
    '@babel/plugin-transform-flow-strip-types',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-transform-runtime',
    '@babel/polyfill'
  ])
  return options
}

/**
 * 设置 webpack
 * @param configFile build 通用 webpack 配置
 * @param mode webpack 环境
 */
function setWebpack (options: ConfigOptions.options, mode: ConfigOptions.webpackMode) {
  options.webpack = options.webpack || {}
  options.webpack.mode = mode
  options.webpack.client = getClientConfig(options)
  options.webpack.server = getServerConfig(options)
  return options
}
/**
 * 设置 静态文件后缀
 * @param configFile build 通用 webpack 配置
 */
function setStaticFileExts (options: ConfigOptions.options) {
  if (!options.staticFileExts || options.staticFileExts.constructor !== Array) {
    options.staticFileExts = []
  }
  options.staticFileExts.concat(getDefaultStaticFileExts())
  return options
}

/**
 * 初始化并获取 BuildService 配置
 * @param argv BuildService 通用 启动参数
 */
export async function initConfig(
  argv: BuildService.parsedArgs,
  mode: ConfigOptions.webpackMode
): Promise<ConfigOptions.options> {
  const rootDir = getRootDir(argv)
  const configFile = getConfigFile(argv)

  let options: any = {}

  if (existsSync(configFile)) {
    options = await compilerConfig(configFile)
    if (!options) {
      options = {}
    } else {
      options = options.default({ argv, mode })
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

  options = setWebpack(options, mode)

  options = setStaticFileExts(options)

  options = setBabelrc(options)

  options.version = argv.version

  buildServiceConfig = options

  return options
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

export function serverStart(app: Express, { port } = { port: 8080 }) {
  app.listen(port, () => {
    console.log(`server started at localhost:${port}`)
  })
}

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
