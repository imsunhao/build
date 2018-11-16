import merge from 'webpack-merge'
import { getBaseConfig } from './webpack.base.config'
import nodeExternals from 'webpack-node-externals'
import VueSSRServerPlugin from 'vue-server-renderer/server-plugin'
import { getStyle } from 'src/utils/style.webpack'

import { ConfigOptions } from '@types'

export function getServerConfig(options: ConfigOptions.options) {
  const server = options.webpack ? options.webpack.server || {} : {}
  return (merge as any)(
    getBaseConfig(options),
    {
      target: 'node',
      devtool: '#source-map',
      entry: './src/entry-server.js',
      output: {
        filename: 'server-bundle.js',
        libraryTarget: 'commonjs2'
      },
      externals: nodeExternals({
        // whitelist: /\.css$/
        whitelist: [/\.css$/, /\?vue&type=style/]
      }),
      plugins: [new VueSSRServerPlugin()]
    },
    getStyle(options, { isServer: true }),
    server
  )
}
