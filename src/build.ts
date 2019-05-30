import { getConfig } from 'src/utils'
import { compiler, showWebpackStats } from 'src/utils/compiler.webpack.ts'
import webpack from 'webpack'

export function serverBuild() {
  const config = getConfig()

  const clientConfig: any = config.webpack ? config.webpack.client || {} : {}
  const serverConfig: any = config.webpack ? config.webpack.server || {} : {}

  compiler(
    {
      serverConfig,
      clientConfig,
      clientCompilerDone: ({ stats }: { stats: webpack.Stats }) => {
        showWebpackStats(stats, { message: 'clientCompilerDone' })
      },
      serverCompilerDone: ({ stats }: { stats: webpack.Stats }) => {
        showWebpackStats(stats, { message: 'serverCompilerDone' })
      }
    },
    'production'
  )
}
