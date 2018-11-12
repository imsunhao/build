import merge from 'webpack-merge'
import { getBaseConfig } from './webpack.base.config'
import VueSSRClientPlugin from 'vue-server-renderer/client-plugin'
import { getStyle } from './utils/style.webpack'

import { ConfigOptions } from 'types/build'

export function getClientConfig(options: ConfigOptions.options) {
  const client = options.webpack ? options.webpack.client || {} : {}
  return merge(
    getBaseConfig(options),
    {
      entry: {
        app: './src/entry-client.js'
      },
      plugins: [new VueSSRClientPlugin()]
    },
    getStyle(options),
    client,
  )
}
