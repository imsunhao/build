import { Express } from 'express'
import { getConfig, BASE_RENDER_OPTIONS } from 'src/utils'
import { compilerExtensions } from 'src/utils/compiler.webpack.ts'

/**
 * 服务器 中间件 路由 插件服务
 * @param app Express 实例
 */
export async function serverExtensions(app?: Express) {
  const config = getConfig()

  if (config.extensions && config.extensions.entry) {
    await compilerExtensions(config, app)
  }
}