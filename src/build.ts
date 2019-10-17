import { getConfig } from 'src/utils'
import { compiler, svgCompiler } from 'src-utils-compiler'
import consola from 'consola'

export function serverBuild() {
  const config = getConfig()

  const clientConfig: any = config.webpack ? config.webpack.client || {} : {}
  const serverConfig: any = config.webpack ? config.webpack.server || {} : {}

  compiler(
    {
      serverConfig,
      clientConfig,
      clientCompilerDone: () => {},
      serverCompilerDone: () => {}
    },
    'production'
  )
}

export function customBuild() {
  const config = getConfig()
  const customConfig: any = config.customBuild || {}

  if (customConfig) {
    svgCompiler(customConfig)
  } else {
    consola.fatal('[customBuild] customConfig is undefined!')
    return process.exit(1)
  }
}