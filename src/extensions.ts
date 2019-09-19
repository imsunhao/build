import { BuildService } from '@types'
import { Express } from 'express'
import { getConfig, routerStackManagement } from 'src/utils'
import { compilerExtensions } from 'src-utils-compiler'
import requireFromString from 'require-from-string'
import consola from 'consola'
import { readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * 服务器 中间件 路由 插件服务
 * @param app Express 实例
 */
export async function serverExtensions(this: any, app?: Express, opt?: BuildService.extensions.options) {
  const config = getConfig()

  if (config.extensions && config.extensions.entry) {
    if (opt && opt.noCompiler) {
      serverExtensionsSync(app, opt)
    } else {
      await compilerExtensions(config, app)
    }
  }
}

export function serverExtensionsSync(this: any, app?: Express, opt?: BuildService.extensions.options) {
  const config = getConfig()
  if (!config.extensions  || !config.extensions.entry) {
    return
  }
  if (!opt || !opt.noCompiler) {
    consola.fatal('[serverExtensions]', 'opt noCompiler!')
    return process.exit(1)
  }
  if (!app) {
    consola.fatal('[serverExtensions]', 'app is undefined')
    return process.exit(1)
  }
  const outputPath = config.extensions.path
  const entrys = config.extensions.entry
  routerStackManagement.init(app)
  Object.keys(entrys).forEach(entry => {
    const name = entry + '.js'
    let extensions: any = {}
    try {
      const souce = readFileSync(resolve(outputPath, name), 'utf-8')
      extensions = requireFromString(souce).default
    } catch (error) {
      consola.fatal('serverExtensions', error)
      return process.exit(1)
    }
    Object.keys(extensions).forEach(extensionKey => {
      const extension = extensions[extensionKey]
      extension(app, routerStackManagement)
    })
  })
}