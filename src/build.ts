import { getConfig } from 'src/utils'
import rimraf from 'rimraf'
import { compiler } from 'src/utils/compiler.webpack.ts'

export function serverBuild() {
  const config = getConfig()

  if (config.webpack && config.webpack.base && config.webpack.base.output) {
    rimraf.sync(config.webpack.base.output.path || '')
  }

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
