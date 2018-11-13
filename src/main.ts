import { getClientConfig, getServerConfig } from 'src/config'
import { getConfig } from 'src/utils'

import { BuildService } from 'types/build'

export function dev(argv: BuildService.parsedArgs) {
  const options = getConfig(argv)
  options.webpack = options.webpack || {}
  options.webpack.mode = 'development'
  const clientConfig = getClientConfig(options)
  const serverConfig = getServerConfig(options)
  console.log('-------------------------------------')
  console.log('clientConfig', JSON.stringify(clientConfig, null, 2))
  console.log('-------------------------------------')
  console.log('getServerConfig', JSON.stringify(serverConfig, null, 2))
  console.log('-------------------------------------')
  console.log('options', options)
  console.log('-------------------------------------')
}

export function build() {
  console.log('build')
}
