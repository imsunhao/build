import { ConfigOptions } from '@bestminr/build'

import { getConfig } from './config'
import getBase from './build/webpack.base.conf.babel'
import getDll from './build/webpack.dll.conf.babel'
import getClient from './build/webpack.client.conf.babel'
import getServer from './build/webpack.server.conf.babel'
import getExtensions from './build/webpack.extensions.conf.babel.js'

export default function(inject: ConfigOptions.getOptionsInject): ConfigOptions.options {
  const config = getConfig(inject)

  const webpack: any = {
    base: getBase(config, inject),
    dll: getDll(config, inject),
    client: getClient(config, inject),
    server: getServer(config, inject),
  }
  const extensions: any = getExtensions(config, inject)

  const { port, render, statics, proxyTable } = config

  return {
    env: ['SERVER_ENV', 'ENV', 'NODE_ENV'],
    port,
    exclude: {
      client: ['globals'],
      server: ['@bestminr/fastblur'],
    },
    babelrc: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            targets: {
              browsers: ['IE >= 11', 'last 2 versions'],
            },
          },
        ],
      ],
    },
    render,
    statics,
    proxyTable,
    extensions,
    webpack,
  }
}
