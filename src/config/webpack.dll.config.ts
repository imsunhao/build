import merge from 'webpack-merge'
import { getDllPlugin } from 'src/utils/plugins.webpack'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'

import { ConfigOptions } from '@types'
import consola from 'consola'
import webpack from 'webpack'

import { getCommonConfig } from './webpack.common.config'
import VueSSRClientPlugin from 'vue-server-renderer/client-plugin'

export function getDllConfig(options: ConfigOptions.options): webpack.Configuration {
  if (!(options.webpack && options.webpack.dll)) {
    consola.fatal('getDllConfig options.webpack.dll is undefined')
    return process.exit(1)
  }

  const mode = options.webpack.mode || 'production'
  const isProd = mode === 'production'
  const dll = options.webpack.dll

  return (merge as any)(
    getCommonConfig(mode),
    {
      name: 'dll',
      mode,
      entry: dll.entry,
      output: {
        path: dll.path,
        publicPath: dll.publicPath,
        filename: '[name].dll.[chunkhash].js',
        library: '[name]'
      },
      resolve: {
        extensions: ['.ts', '.js', '.vue', '.json']
      },
      optimization: {
        minimizer: [
          new UglifyJsPlugin({
            parallel: true
          })
        ]
      },
      performance: {
        maxEntrypointSize: 1024 * 500,
        maxAssetSize: 1024 * 500,
        hints: isProd ? 'warning' : false
      },
      plugins: [
        new VueSSRClientPlugin({
          filename: 'vue-ssr-dll-manifest.json'
        })
      ]
    },
    getDllPlugin(dll),
    dll.webpack
  )
}
