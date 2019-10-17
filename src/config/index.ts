import { getClientConfig, getClientConfigSync } from './webpack.client.config'
import { getSvgConfig } from './webpack.svg.config'
import { getServerConfig } from './webpack.server.config'
import HappyPack from 'happypack'

export { getClientConfig, getServerConfig, getClientConfigSync, getSvgConfig }

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