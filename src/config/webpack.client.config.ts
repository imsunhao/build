import merge from 'webpack-merge'
import { getBaseConfig } from './webpack.base.config'
import VueSSRClientPlugin from 'vue-server-renderer/client-plugin'
import { getStyle } from 'src/utils/style.webpack'
import webpack from 'webpack'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'

import { ConfigOptions } from '@types'
import { getClientDllPlugin } from 'src/utils/plugins.webpack'

export async function getClientConfig(options: ConfigOptions.options) {
  const client = options.webpack ? options.webpack.client || {} : {}
  return (merge as any)(
    getBaseConfig(options),
    {
      name: 'client',
      entry: {
        app: './src/entry-client.js'
      },
      output: {
        globalObject: 'this'
      },
      optimization: {
        minimizer: [
          new OptimizeCSSAssetsPlugin()
        ],
        splitChunks: {
          cacheGroups: {
            styles: {
              name: 'styles',
              test: /\.css$/,
              chunks: 'all',
              enforce: true
            }
          }
        }
      },
      plugins: [
        new VueSSRClientPlugin(),
        new webpack.DefinePlugin({
          'process.env.VUE_ENV': '"client"'
        })
      ]
    },
    getStyle(options, { isServer: false }),
    await getClientDllPlugin(options),
    client
  )
}
