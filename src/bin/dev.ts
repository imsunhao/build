import { initConfig, serverInit, serverStart } from 'src/utils'

import { BuildService } from '@types'
import consola from 'consola'
import { serverRender } from 'src/render'

async function devMain(argv: BuildService.parsedArgs) {
  consola.ready(`@bestminr/build v${argv.version}`)
  consola.start('development mode')
  const options = await initConfig(argv, 'development')

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
  // delete options.webpack
  // console.log('options', JSON.stringify(options, null, 2))
  // console.log('-------------------------------------')
}

export { devMain as start }
