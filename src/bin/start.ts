import { initConfig, serverInit, serverStart } from 'src/utils'

import { BuildService } from '@types'
import consola from 'consola'
import { serverRender } from 'src/render'
import { serverExtensions } from 'src/extensions'

async function main(argv: BuildService.parsedArgs) {
  consola.ready(`@bestminr/build v${argv.version}`)
  consola.start('start with production mode')
  const options = await initConfig(argv, 'production')

  const app = serverInit({
    statics: options.statics,
    proxyTable: options.proxyTable
  })

  await serverExtensions(app, {
    noCompiler: true
  })

  serverRender(app)


  serverStart(app, argv)


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

export { main as start }