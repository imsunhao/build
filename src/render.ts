import { ConfigOptions, BuildService } from '@types'
import { Express } from 'express'
import { getRender } from 'src/utils/render'
import { createBundleRenderer } from 'vue-server-renderer'
import path from 'path'
import webpack from 'webpack'
import MFS from 'memory-fs'
import { readFileSync } from 'fs'
import chokidar from 'chokidar'
import cookieParser from 'cookie-parser'
import webpackHotMiddleware from 'webpack-hot-middleware'
import { getConfig, BASE_RENDER_OPTIONS } from 'src/utils'
import consola from 'consola'

export function serverRender(app: Express) {
  const config = getConfig()
  const clientConfig: any = config.webpack ? config.webpack.client || {} : {}
  const serverConfig: any = config.webpack ? config.webpack.server || {} : {}

  const readFile = (fs: any, file: string) => {
    const outputPath = clientConfig.output ? clientConfig.output.path || '' : ''
    try {
      return fs.readFileSync(path.join(outputPath, file), 'utf-8')
    } catch (e) {
      consola.error(e)
    }
  }

  let render: BuildService.getRender.renderFn,
    ready: (render: BuildService.getRender.renderFn) => void
  const renderOptions = {
    bundle: '',
    template: '',
    clientManifest: ''
  }

  const renderConfigOptions: ConfigOptions.renderOptions = config.render
    ? config.render.options
    : ({} as any)

  if (!renderConfigOptions.templatePath || !renderConfigOptions.basedir) {
    consola.error('renderConfigOptions renderConfigOptions is not init!')
    return
  }

  const readyPromise = new Promise(r => {
    ready = r
  })

  const update = (type: BuildService.getRender.updateType) => {
    if (renderOptions.bundle && renderOptions.clientManifest) {
      consola.info(`updated by ${type} time: ${new Date().toLocaleString()}`)
      const renderConfig = config.render ? config.render.options : {}
      const templatePath = config.render
        ? config.render.options.templatePath
        : ''
      const clientManifest: any = renderOptions.clientManifest
      render = getRender(
        createBundleRenderer(renderOptions.bundle, {
          ...(BASE_RENDER_OPTIONS as any),
          ...renderConfig,
          template: readFileSync(templatePath, 'utf-8'),
          clientManifest
        }),
        {
          siteInfo: config.siteInfo
        }
      )
      ready(render)
    }
  }
  // modify client config to work with hot middleware
  const entry = clientConfig.entry
  Object.keys(entry).forEach(key => {
    entry[key] = ['webpack-hot-middleware/client'].concat(entry[key])
  })

  clientConfig.output.filename = '[name].js'
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )

  // dev middleware
  const clientCompiler = webpack(clientConfig)
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true,
    writeToDisk: false
  })

  app.use(devMiddleware)

  clientCompiler.plugin('done', stats => {
    stats = stats.toJson()
    stats.errors.forEach((err: any) => consola.error(err))
    stats.warnings.forEach((err: any) => consola.info(err))
    if (stats.errors.length) return

    renderOptions.clientManifest = JSON.parse(
      readFile(devMiddleware.fileSystem, 'vue-ssr-client-manifest.json')
    )
    update('clientManifest')
  })

  // hot middleware
  app.use(webpackHotMiddleware((clientCompiler as any), { heartbeat: 5000 }))

  // watch and update server renderer
  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err

    stats = stats.toJson()

    renderOptions.bundle = JSON.parse(
      readFile(mfs, 'vue-ssr-server-bundle.json')
    )
    update('bundle')
  })

  renderOptions.template = readFileSync(
    renderConfigOptions.templatePath,
    'utf-8'
  )
  chokidar.watch(renderConfigOptions.templatePath).on('change', () => {
    renderOptions.template = readFileSync(
      renderConfigOptions.templatePath,
      'utf-8'
    )
    update('template')
  })

  app.use(cookieParser())

  readyPromise.then(() => {
    app.get('*', (req: any, res, next) => {
      render(req, res, next)
    })
  })
}
