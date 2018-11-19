import merge from 'webpack-merge'
import { getBaseConfig } from './webpack.base.config'
import VueSSRClientPlugin from 'vue-server-renderer/client-plugin'
import { getStyle } from 'src/utils/style.webpack'

import { ConfigOptions } from '@types'
import { getClientDllPlugin } from 'src/utils/plugins.webpack';

export async function getClientConfig(options: ConfigOptions.options) {
  const client = options.webpack ? options.webpack.client || {} : {}
  return (merge as any)(
    getBaseConfig(options),
    {
      entry: {
        app: './src/entry-client.js'
      },
      plugins: [new VueSSRClientPlugin()]
    },
    getStyle(options, { isServer: false }),
    await getClientDllPlugin(options),
    client
  )
}
