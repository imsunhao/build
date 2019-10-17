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

export function svgBuild() {
  const config = getConfig()
  const svgConfig: any = config.webpack ? config.webpack.svg || {} : {}

  if (svgConfig) {
    svgCompiler(svgConfig)
  } else {
    consola.fatal('[svgBuild] svgConfig is undefined!')
    return process.exit(1)
  }
}