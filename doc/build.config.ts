import { ConfigOptions } from '@bestminr/build'

import { getConfig } from './config'
import getBase from './build/webpack.base.conf.babel'
import getDll from './build/webpack.dll.conf.babel'
import getClient from './build/webpack.client.conf.babel'
import getServer from './build/webpack.server.conf.babel'
import path from 'path'

export default function(inject: ConfigOptions.getOptionsInject): ConfigOptions.options {
  const config = getConfig(inject)

  const base: any = getBase(config, inject)
  const dll: any = getDll(config, inject)
  const client: any = getClient(config, inject)
  const server: any = getServer(config, inject)

  return {
    env: ['SERVER_ENV', 'ENV', 'NODE_ENV'],
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
    render: config.render,
    statics: config.statics,
    proxyTable: config.proxyTable,
    extensions: {
      entry: {
        extensions: inject.resolve('./server/index.js'),
      },
      path: path.resolve(base.output.path),
    },
    webpack: {
      dll,
      base,
      client,
      server,
    },
  }
}
