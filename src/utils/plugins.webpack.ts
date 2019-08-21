import { ConfigOptions } from '@types'

import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

import { join } from 'path'
import { existsSync, readFileSync } from 'fs'
import requireFromString from 'require-from-string'
import consola from 'consola'
import { compilerDll } from 'src/utils/compiler.webpack'
import { getValue } from 'src/utils/get'

export function getDllPlugin({
  path,
  define,
  template,
  templateOutput
}: ConfigOptions.options.webpackDll) {
  return {
    plugins: [
      new webpack.DllPlugin({
        path: join(path, '[name].manifest.json'),
        name: '[name]'
      }),
      new webpack.DefinePlugin(define),
      new HtmlWebpackPlugin({
        filename: join(templateOutput, 'index.template.html'),
        template,
        inject: false,
        showErrors: false,
        minify: {
          removeComments: false,
          collapseWhitespace: true,
          removeAttributeQuotes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency'
      })
    ]
  }
}
/**
 * 获取 客户端dll插件
 * @param options build 通用 webpack 配置
 */
export async function getClientDllPlugin(options: ConfigOptions.options) {
  if (!(options.webpack && options.webpack.dll && options.webpack.base))
    return {}
  const dll = options.webpack.dll
  const webpackConfig = options.webpack.base
  const nameArr = Object.keys(dll.entry)
  const plugins: any[] = []

  if (!existsSync(dll.path)) {
    await compilerDll(options)
  }

  nameArr.forEach(name => {
    const path = join(dll.path, `/${name}.manifest.json`)
    if (existsSync(path)) {
      const manifest = requireFromString(
        'module.exports = ' + readFileSync(path, { encoding: 'utf-8' })
      )
      plugins.push(
        new webpack.DllReferencePlugin({
          context: webpackConfig.context || '',
          manifest
        })
      )
    } else {
      consola.fatal('path is not find!', path)
    }
  })
  return {
    plugins
  }
}

/**
 * 获取 alias
 * - 主要是对 只存在于server端或者client端 插件 支持
 * @param options build 通用 webpack 配置
 */
export function getExternals(options: ConfigOptions.options, type: 'client' | 'server') {
  return getValue(options, 'exclude', type) || []
}