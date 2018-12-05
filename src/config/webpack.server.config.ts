import merge from 'webpack-merge'
import { getBaseConfig } from './webpack.base.config'
import nodeExternals from 'webpack-node-externals'
import webpack from 'webpack'
import consola from 'consola'
import VueSSRServerPlugin from 'vue-server-renderer/server-plugin'
import { getStyle } from 'src/utils/style.webpack'

import { ConfigOptions } from '@types'

export function getServerConfig(options: ConfigOptions.options) {
  if (!(options.webpack && options.webpack.mode)) {
    consola.fatal(
      'getBaseConfig options.babelrc or options.webpack is undefined'
    )
    return process.exit(0)
  }
  const server = options.webpack.server || {}
  const mode = options.webpack.mode || 'production'
  const isProd = mode === 'production'
  return (merge as any)(
    getBaseConfig(options),
    {
      name: 'server',
      target: 'node',
      entry: './src/entry-server.js',
      output: {
        libraryTarget: 'commonjs2'
      },
      externals: nodeExternals({
        // whitelist: /\.css$/
        whitelist: [/\.css$/, /\?vue&type=style/]
      }),
      performance: {
        maxEntrypointSize: 1024 * 1024 * 6,
        maxAssetSize: 1024 * 1024 * 3,
        hints: isProd ? 'warning' : false
      },
      plugins: [
        new VueSSRServerPlugin(),
        new webpack.DefinePlugin({
          'process.env.VUE_ENV': '"server"'
        })
      ]
    },
    getStyle(options, { isServer: true }),
    server
  )
}
