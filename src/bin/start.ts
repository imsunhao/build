import { getUserConfigSync, serverInit, serverStart, setStaticFileExts, setVersion, setBuildServiceConfig, setPublicPath } from 'src/utils'

import { BuildService } from '@types'
import consola from 'consola'
import { serverRender } from 'src/render'
import { serverExtensionsSync } from 'src/extensions'

async function main(argv: BuildService.parsedArgs) {
  consola.ready(`@bestminr/build v${argv.version}`)
  consola.start('start with production mode')

  const options = getUserConfigSync('none', argv)

  setStaticFileExts(options)

  options.buildVersion = argv.version

  setVersion(options)

  setBuildServiceConfig(options)

  if (options.webpack && options.webpack.base && options.webpack.base.output && options.webpack.base.output.path) {
    setPublicPath(options.rootDir, options.webpack.base.output.path)
  } else {
    console.warn('未找到用户设置的 options.webpack.base.output.path. PUBLIC_PATH = injectContext.STATIC_HOST')
    process.env.PUBLIC_PATH = options.injectContext.STATIC_HOST || ''
  }

  const app = serverInit()

  serverExtensionsSync(app, {
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