import { getClientConfig, getClientConfigSync } from './webpack.client.config'
import { getCustomConfig } from './webpack.custom-build.config'
import { getServerConfig } from './webpack.server.config'
import HappyPack from 'happypack'

export { getClientConfig, getServerConfig, getClientConfigSync, getCustomConfig }

/**
 * 制作 HappyPack plugin
 */
export function makeHappyPack(id: any, loaders: any) {
  return new HappyPack({
    id,
    threads: 4,
    loaders
  })
}