import merge from 'webpack-merge'
import { getCommonBaseConfig } from './webpack.base.config'
import consola from 'consola'

import { ConfigOptions } from '@types'

export function getSvgConfig(options: ConfigOptions.options) {
  if (!(options.webpack && options.webpack.mode)) {
    consola.fatal(
      '[getSvgConfig] options.webpack or options.webpack.mode is undefined'
    )
    return process.exit(1)
  }
  if (options.webpack.svg) {
    const svg = options.webpack.svg.webpack || options.webpack.svg || {}
    const mode = options.webpack.mode || 'production'
    const base: any = options.webpack ? options.webpack.base || {} : {}
    return (merge as any)(
      getCommonBaseConfig(options),
      {
        name: 'svg',
        mode,
        devtool: false,
        output: base.output,
        resolve: base.resolve
      },
      svg
    )
  } else {
    consola.fatal(
      '[getServerConfig] options.webpack.svg is undefined'
    )
    return process.exit(1)
  }
}
