import merge from 'webpack-merge'
import { getBaseConfig } from './webpack.base.config'
import VueSSRClientPlugin from 'vue-server-renderer/client-plugin'
import { getStyle } from 'src/utils/style.webpack'
import webpack from 'webpack'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'

import { ConfigOptions } from '@types'
import { getClientDllPlugin, getExternals, getClientDllPluginSync } from 'src/utils/plugins.webpack'

function baseGetClientConfig(options: ConfigOptions.options) {
  const { externals, alias } = getExternals(options, 'client')
  const mode = options.webpack.mode || 'production'
  const isProd = mode === 'production'
  const client = options.webpack ? options.webpack.client || {} : {}
  const rules = []
  if (client.module && client.module.rules) {
    const babelJS = client.module.rules.find(rule => rule.test === /\.js$/)
    if (!babelJS) {
      rules.push({
        test: /\.js$/,
        loader: 'happypack/loader?id=babel',
        exclude: /node_modules/
      })
    }
    const babelTS = client.module.rules.find(rule => rule.test === /\.tsx?$/)
    if (!babelTS) {
      rules.push({
        test: /\.tsx?$/,
        use: [
          'happypack/loader?id=babel',
          'happypack/loader?id=ts'
        ],
        exclude: /node_modules/
      })
    }
  }
  return (merge as any)(
    getBaseConfig(options),
    {
      name: 'client',
      entry: {
        app: './src/entry-client.js'
      },
      module: {
        rules
      },
      resolve: {
        alias
      },
      externals,
      output: {
        globalObject: 'this'
      },
      optimization: {
        runtimeChunk: !isProd,
        minimizer: [new OptimizeCSSAssetsPlugin()],
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
    getStyle(options, { isServer: false })
  )
}

export async function getClientConfig(options: ConfigOptions.options) {
  const client = options.webpack ? options.webpack.client || {} : {}

  return (merge as any)(baseGetClientConfig(options), await getClientDllPlugin(options), client)
}

export function getClientConfigSync(options: ConfigOptions.options) {
  const client = options.webpack ? options.webpack.client || {} : {}

  return (merge as any)(baseGetClientConfig(options), getClientDllPluginSync(options), client)
}
