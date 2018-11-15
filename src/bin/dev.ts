import { initConfig, serverInit, serverStart } from 'src/utils'

import { BuildService } from 'types/build'
import consola from 'consola'
import { serverRender } from 'src/render'

function devMain(argv: BuildService.parsedArgs) {
  const options = initConfig(argv, 'development')
  consola.start(`@bestminr/build v${argv.version}`)
  consola.info('development mode')

  const app = serverInit({
    statics: options.statics,
    proxyTable: options.proxyTable
  })

  serverRender(app)

  serverStart(app)
  // const webpack: any = options.webpack
  // const clientConfig = webpack.client
  // const serverConfig = webpack.client
  // console.log('-------------------------------------')
  // console.log('clientConfig', JSON.stringify(clientConfig, null, 2))
  // console.log('-------------------------------------')
  // console.log('getServerConfig', JSON.stringify(serverConfig, null, 2))
  // console.log('-------------------------------------')
  // console.log('options', options)
  // console.log('-------------------------------------')
}

export { devMain as start }
