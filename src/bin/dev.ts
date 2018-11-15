import { getConfig, serverInit, serverStart } from 'src/utils'

import { BuildService } from 'types/build'
import consola from 'consola'

function devMain(argv: BuildService.parsedArgs) {
  const options = getConfig(argv, 'development')
  consola.start(`@bestminr/build v${argv.version}`)
  consola.info('development mode')
  const app = serverInit({
    statics: options.statics,
    proxyTable: options.proxyTable
  })
  serverStart(app)
  // const clientConfig = getClientConfig(options)
  // const serverConfig = getServerConfig(options)
  // console.log('-------------------------------------')
  // console.log('clientConfig', JSON.stringify(clientConfig, null, 2))
  // console.log('-------------------------------------')
  // console.log('getServerConfig', JSON.stringify(serverConfig, null, 2))
  // console.log('-------------------------------------')
  // console.log('options', options)
  // console.log('-------------------------------------')
}

export { devMain as start }
