import { getClientConfig, getClientConfigSync } from './webpack.client.config'
import { getServerConfig } from './webpack.server.config'

export { getClientConfig, getServerConfig, getClientConfigSync }

/**
 * 制作 HappyPack plugin
 */
export function makeHappyPack(id: any, loaders: any) {
  const HappyPack = require('HappyPack')
  return new HappyPack({
    id,
    threads: 4,
    loaders
  })
}