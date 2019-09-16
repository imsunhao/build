import { ConfigOptions, BuildService } from '@types'
import MFS from 'memory-fs'
import webpack from 'webpack'
import consola from 'consola'
import { getConfigConfig } from 'src/config/webpack.config.config'
import { getDllConfig } from 'src/config/webpack.dll.config'
import { getExtensionsConfig } from 'src/config/webpack.extensions.config'
import requireFromString from 'require-from-string'
import { resolve } from 'path'
import { readFileSync, existsSync } from 'fs'
import { Express } from 'express'
import { routerStackManagement } from 'src/utils'

function showError(stats: webpack.Stats, { isdev }: { isdev?: boolean } = {}) {
  if (stats.hasWarnings()) {
    stats.compilation.warnings.forEach(warning => {
      consola.info(warning)
    })
  }
  if (stats.hasErrors()) {
    stats.compilation.errors.forEach(error => {
      consola.fatal(error)
    })
    if (!isdev) return process.exit(1)
  }
}

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
  const clientCompiler = getCompiler(clientConfig)
  clientCompiler.plugin('done', stats => {
    clientCompilerDone({ stats })
  })

  clientCompiler.run((err, stats) => {
    consola.log(stats.toString())
  })

  const serverCompiler = getCompiler(serverConfig)
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
    showError(stats, { isdev: false })
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
  if (
    !(
      clientConfig.output &&
      serverConfig.output &&
      clientConfig.plugins &&
      clientConfig.entry
    )
  ) {
    consola.fatal(
      '{clientConfig, serverConfig}.{output, plugins, entry} is undefined'
    )
    return process.exit(1)
  }

  const entry: any = clientConfig.entry
  Object.keys(entry).forEach(key => {
    entry[key] = ['webpack-hot-middleware/client'].concat(entry[key])
  })

  clientConfig.output.filename = '[name].js'
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin({
      multiStep: true,
    }),
    new webpack.NoEmitOnErrorsPlugin()
  )

  const clientCompiler = getCompiler(clientConfig)

  // clientCompiler.hooks.compile.tap('stats-plugin', stats => {
  //   consola.info('compile\n', JSON.stringify(stats, null, 2))
  // })

  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true,
    logLevel: 'warn',
    writeToDisk: false
  })

  app.use(devMiddleware)

  clientCompiler.plugin('done', stats => {
    clientCompilerDone({ devMiddleware, stats })
  })

  // hot middleware
  app.use(
    require('webpack-hot-middleware')(clientCompiler as any, {
      heartbeat: 5000
    })
  )

  // watch and update server renderer
  const serverCompiler = getCompiler(serverConfig)
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
  consola.log('compiling', mode)
  const isProd = mode === 'production'

  if (isProd) {
    prodCompiler(options as BuildService.compiler.prodCompilerOptions)
  } else {
    devCompiler(options as BuildService.compiler.devCompilerOptions)
  }
}

export function compilerConfigSync(
  configOptions: BuildService.parsedArgs.config,
  mode: ConfigOptions.webpackMode
) {
  const entryName = `${mode === 'none' ? 'production' : mode}_config`
  const { entry, output } = configOptions
  if (!(entry && output)) {
    consola.fatal('[compilerConfigSync]: entry or output is undefined')
    return process.exit(1)
  }
  const path = resolve(output, `${entryName}.js`)
  let config: any = {}
  if (existsSync(path)) {
    try {
      const souce = readFileSync(path, 'utf-8')
      config = requireFromString(souce)
    } catch (error) {
      consola.fatal('[compilerConfigSync]', error)
      return process.exit(1)
    }
    return config
  } else {
    consola.fatal('[compilerConfigSync]: path is unExist!', path)
    return process.exit(1)
  }
}

/**
 * webpack 编译 配置文件
 * @param configOptions 配置文件 设置
 */
export function compilerConfig(
  configOptions: BuildService.parsedArgs.config,
  mode: ConfigOptions.webpackMode,
  { rootDir }: { rootDir: string }
): Promise<() => webpack.Configuration> {
  return new Promise(function(this: any, done) {
    const webpackConfig = getConfigConfig({ rootDir })
    const entryName = `${mode === 'none' ? 'production' : mode}_config`
    const { entry, output } = configOptions

    if (!(entry && output)) {
      consola.fatal('compilerConfig: entry or output is undefined')
      return process.exit(1)
    }

    webpackConfig.mode = mode
    webpackConfig.entry = {
      [entryName]: entry
    }

    if (webpackConfig.output) {
      webpackConfig.output.path = output
    } else {
      consola.error('webpackConfig.output is undefined!')
      return {}
    }

    const path = resolve(output, `${entryName}.js`)
    let config: any = {}

    if (existsSync(path)) {
      try {
        const souce = readFileSync(path, 'utf-8')
        config = requireFromString(souce)
      } catch (error) {
        consola.fatal('compilerConfig', error)
        return process.exit(1)
      } finally {
        done(config)
      }
    } else if (mode !== 'none') {
      const compiler = getCompiler(webpackConfig)
      compiler.plugin('done', stats => {
        stats = stats.toJson()
        stats.errors.forEach((err: any) => consola.error(err))
        stats.warnings.forEach((err: any) => consola.info(err))
        if (stats.errors.length) return
        try {
          const souce = readFileSync(path, 'utf-8')
          config = requireFromString(souce)
        } catch (error) {
          consola.fatal('compilerConfig', error)
          return process.exit(1)
        } finally {
          done(config)
        }
      })
      compiler.run((err, stats) => {
        showError(stats)
      })
    } else {
      consola.fatal('compilerConfig: config path not find.', path)
      return process.exit(1)
    }
  })
}

/**
 * webpack 编译 dll
 * @param options build 通用 webpack 配置
 */
export function compilerDll(options: ConfigOptions.options): Promise<any> {
  return new Promise(function(done) {
    const webpackConfig = getDllConfig(options)

    const compiler = getCompiler(webpackConfig)
    compiler.plugin('done', stats => {
      stats = stats.toJson()
      stats.errors.forEach((err: any) => consola.error(err))
      stats.warnings.forEach((err: any) => consola.info(err))
      if (stats.errors.length) {
        consola.fatal('build dll fail!')
        return process.exit(1)
      }
      done()
    })

    compiler.run((err, stats) => {
      {
        consola.log(
          stats.toString({
            all: false,
            assets: true
          })
        )
        showError(stats)
      }
    })
  })
}

/**
 * webpack 编译 dll
 * @param options build 通用 webpack 配置
 * @param app Express 实例
 */
export async function compilerExtensions(
  options: ConfigOptions.options,
  app?: Express
) {
  if (!(options.webpack && options.extensions && options.webpack.mode)) {
    consola.fatal('options.extensions or options.webpack.mode is undefined')
    return process.exit(1)
  }

  const isProd = options.webpack.mode === 'production'
  consola.log('compiling compilerExtensions', options.webpack.mode)

  if (isProd) {
    await prodCompilerExtensions(options)
  } else {
    await devCompilerExtensions(options, app)
  }
}

function prodCompilerExtensions(options: ConfigOptions.options) {
  return new Promise(function(done) {
    const webpackConfig = getExtensionsConfig(options)

    const compiler = getCompiler(webpackConfig)
    compiler.plugin('done', stats => {
      stats = stats.toJson()
      stats.errors.forEach((err: any) => consola.error(err))
      stats.warnings.forEach((err: any) => consola.info(err))
      if (stats.errors.length) {
        consola.fatal('build extensions fail!')
        return process.exit(1)
      }
      done()
    })

    compiler.run((err, stats) => {
      {
        if (err) {
          consola.fatal(err)
        } else {
          consola.log(
            stats.toString({
              all: false,
              assets: true
            })
          )
          showError(stats)
        }
      }
    })
  })
}
function devCompilerExtensions(options: ConfigOptions.options, app?: Express) {
  if (!(app && options.extensions && options.extensions.entry)) {
    consola.fatal('devCompilerExtensions: app is undefined')
    return process.exit(1)
  }

  const outputPath = options.extensions.path
  const entrys = options.extensions.entry

  return new Promise(function(done) {
    const webpackConfig = getExtensionsConfig(options)
    if (!webpackConfig.plugins) webpackConfig.plugins = []
    webpackConfig.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    )

    const compiler = getCompiler(webpackConfig)
    const serverDevMiddleware = require('webpack-dev-middleware')(compiler, {
      noInfo: true,
      logLevel: 'silent'
    })
    app.use(serverDevMiddleware)

    const mfs = new MFS()
    compiler.outputFileSystem = mfs

    compiler.plugin('done', function(this: any, stats) {
      routerStackManagement.init(app)
      showError(stats, { isdev: true })

      Object.keys(entrys).forEach(entry => {
        const name = entry + '.js'
        let extensions: any = {}
        try {
          const souce = mfs.readFileSync(resolve(outputPath, name), 'utf-8')
          extensions = requireFromString(souce).default
        } catch (error) {
          consola.fatal('devCompilerExtensions', resolve(outputPath, name), error)
          return process.exit(1)
        }
        Object.keys(extensions).forEach(extensionKey => {
          const extension = extensions[extensionKey]
          extension(app, routerStackManagement)
        })
      })
      done()
    })

    app.use(require('webpack-hot-middleware')(compiler, { heartbeat: 5000 }))
  })
}

/**
 * 获取 webpack Compiler
 * @param config webpack 配置文件
 */
function getCompiler(config: webpack.Configuration) {
  consola.info('Working Compiler:', config.name, '\n')
  return webpack(config)
}
