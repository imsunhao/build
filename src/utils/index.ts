import { resolve } from 'path'
import { existsSync, readFileSync } from 'fs'

import { BuildService } from 'types/build'

import consola from 'consola'

import { ConfigOptions } from 'types/build'
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

/**
 * 获取 BuildService 配置
 * @param argv BuildService 通用 启动参数
 */
export function getConfig(argv: BuildService.parsedArgs): ConfigOptions.options {
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

  return options
}