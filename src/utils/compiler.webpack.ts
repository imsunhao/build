import { ConfigOptions, BuildService } from '@types'
import MFS from 'memory-fs'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpack from 'webpack'
import consola from 'consola'

/**
 * webpack 编译 mode production 编译
 * @param compilerOptions dev compiler 参数
 */
function prodCompiler({
  clientConfig,
  serverConfig,
  clientCompilerDone,
  serverCompilerDone
}: BuildService.compiler.prodCompilerOptions) {
  const clientCompiler = webpack(clientConfig)
  clientCompiler.plugin('done', stats => {
    clientCompilerDone({ stats })
  })

  clientCompiler.run((err, stats) => {
    consola.log(stats.toString())
  })

  const serverCompiler = webpack(serverConfig)
  serverCompiler.plugin('done', stats => {
    serverCompilerDone({ stats })
  })
  serverCompiler.run((err, stats) => {
    consola.log(
      stats.toString({
        errors: false,
        warnings: false
      })
    )
    if (stats.hasWarnings()) {
      stats.compilation.warnings.forEach(warning => {
        consola.info(warning)
      })
    }
    if (stats.hasErrors()) {
      stats.compilation.errors.forEach(error => {
        consola.fatal(error)
      })
    }
  })
}

/**
 * webpack 编译 mode development 编译
 * @param compilerOptions dev compiler 参数
 */
function devCompiler({
  clientConfig,
  serverConfig,
  clientCompilerDone,
  serverCompilerDone,
  app
}: BuildService.compiler.devCompilerOptions) {
  if (!(clientConfig.output && clientConfig.plugins && clientConfig.entry)) {
    consola.fatal('clientConfig.{output, plugins, entry} is undefined')
    return process.exit(0)
  }

  const entry: any = clientConfig.entry
  Object.keys(entry).forEach(key => {
    entry[key] = ['webpack-hot-middleware/client'].concat(entry[key])
  })

  clientConfig.output.filename = '[name].js'
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )

  const clientCompiler = webpack(clientConfig)

  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true,
    writeToDisk: false
  })

  app.use(devMiddleware)

  clientCompiler.plugin('done', stats => {
    clientCompilerDone({ devMiddleware, stats })
  })

  // hot middleware
  app.use(webpackHotMiddleware(clientCompiler as any, { heartbeat: 5000 }))

  // watch and update server renderer
  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    serverCompilerDone({ err, stats, mfs })
  })
}

/**
 * webpack 编译
 * @param options compilerOptions 编译配置
 * @param mode 编译mode
 */
export function compiler(
  options: BuildService.compiler.compilerOptions,
  mode?: ConfigOptions.webpackMode
) {
  const isProd = mode === 'production'

  if (isProd) {
    prodCompiler(options as BuildService.compiler.prodCompilerOptions)
  } else {
    devCompiler(options as BuildService.compiler.devCompilerOptions)
  }
}
