import { resolve } from 'path'
import { ConfigOptions, BuildService } from '@types'

import { getClientConfig, getServerConfig } from 'src/config'
import { existsSync, readFileSync } from 'fs'
import consola from 'consola'

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
 * 初始化并获取 BuildService 配置
 * @param argv BuildService 通用 启动参数
 */
export function initConfig(
  argv: BuildService.parsedArgs,
  mode: ConfigOptions.webpackMode
): ConfigOptions.options {
  const rootDir = getRootDir(argv)
  const configFile = getConfigFile(argv)

  let options: any = {}

  if (existsSync(configFile)) {
    delete require.cache[configFile]
    options = readFileSync(configFile, {
      encoding: 'utf-8'
    })
    try {
      options = JSON.parse(options)
    } catch (error) {
      consola.fatal('Could not JSON.parse config file: ' + argv['config-file'])
    }
    if (!options) {
      options = {}
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

  options.webpack = options.webpack || {}
  options.webpack.mode = mode
  options.webpack.client = getClientConfig(options)
  options.webpack.server = getServerConfig(options)

  if (!options.staticFileExts || options.staticFileExts.constructor !== Array) {
    options.staticFileExts = []
  }

  options.staticFileExts.concat(getDefaultStaticFileExts())

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

export function serverStart(app: Express, { port } = { port: 7001 }) {
  app.listen(port, () => {
    console.log(`server started at localhost:${port}`)
  })
}

function serverStatics(app: Express, statics?: BuildService.statics) {
  if (!statics) return

  Object.keys(statics).forEach(eStaticKey => {
    const eStatic = statics[eStaticKey]
    console.log('serverStatics', eStaticKey, eStatic.path, eStatic.maxAge)
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
