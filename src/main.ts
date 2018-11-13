import { getClientConfig, getServerConfig } from 'src/config'
import { getConfig } from 'src/utils'

import { BuildService } from 'types/build'

export function dev(argv: BuildService.parsedArgs) {
  const options = getConfig(argv)
  options.webpack = options.webpack || {}
  options.webpack.mode = 'development'
  console.log('-------------------------------------')
  console.log('getClientConfig', JSON.stringify(getClientConfig(options), null, 2))
  console.log('-------------------------------------')
  console.log('getServerConfig', JSON.stringify(getServerConfig(options), null, 2))
  console.log('-------------------------------------')
}

export function build() {
  console.log('build')
}
