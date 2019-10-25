import merge from 'webpack-merge'
import { getCommonBaseConfig } from './webpack.base.config'
import consola from 'consola'

import { ConfigOptions } from '@types'

export function getCustomConfig(options: ConfigOptions.options, target: string) {
  if (!(options.webpack && options.webpack.mode)) {
    consola.fatal('[getCustomConfig] options.webpack or options.webpack.mode is undefined')
    return process.exit(1)
  }

  if (!(options.customBuild && options.customBuild[target])) {
    consola.fatal(
      `[getCustomConfig] options.customBuild or options.customBuild[${target}] is undefined`
    )
    return process.exit(1)
  }

  if (options.customBuild[target]) {
    const customBuild = options.customBuild[target] || {}
    const rules = []
    if (customBuild.module && customBuild.module.rules) {
      const babelJS = customBuild.module.rules.find(rule => rule.test === /\.js$/)
      if (!babelJS) {
        rules.push({
          test: /\.js$/,
          loader: 'happypack/loader?id=babel',
          exclude: /node_modules/
        })
      }
      const babelTS = customBuild.module.rules.find(rule => rule.test === /\.tsx?$/)
      if (!babelTS) {
        rules.push({
          test: /\.tsx?$/,
          use: ['happypack/loader?id=babel', 'happypack/loader?id=ts'],
          exclude: /node_modules/
        })
      }
    }
    const mode = options.webpack.mode || 'production'
    const base: any = options.webpack ? options.webpack.base || {} : {}
    return (merge as any)(
      getCommonBaseConfig(options),
      {
        name: target,
        mode,
        module: {
          rules
        },
        devtool: false,
        output: base.output,
        resolve: base.resolve
      },
      customBuild
    )
  } else {
    consola.fatal(`[getServerConfig] options.webpack[${target}] is undefined`)
    return process.exit(1)
  }
}
