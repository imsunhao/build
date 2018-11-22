import { ConfigOptions, BuildService } from '@types'
import { Express } from 'express'
import { getRender } from 'src/utils/render'
import { createBundleRenderer } from 'vue-server-renderer'
import path from 'path'
import { readFileSync } from 'fs'
import chokidar from 'chokidar'
import cookieParser from 'cookie-parser'
import { getConfig, BASE_RENDER_OPTIONS } from 'src/utils'
import { compiler } from 'src/utils/compiler.webpack.ts'
import consola from 'consola'

/**
 * dev 服务器渲染 服务
 * @param app Express 实例
 */
export function serverDevRender(app: Express) {
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

  const renderConfigOptions: ConfigOptions.options.renderOptions = config.render
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

  function clientCompilerDone({ devMiddleware, stats }: any) {
    stats = stats.toJson()
    stats.errors.forEach((err: any) => consola.error(err))
    stats.warnings.forEach((err: any) => consola.info(err))
    if (stats.errors.length) return

    renderOptions.clientManifest = JSON.parse(
      readFile(devMiddleware.fileSystem, 'vue-ssr-client-manifest.json')
    )
    update('clientManifest')
  }

  function serverCompilerDone({ err, mfs, stats }: any) {
    if (err) throw err

    stats = stats.toJson()

    renderOptions.bundle = JSON.parse(
      readFile(mfs, 'vue-ssr-server-bundle.json')
    )
    update('bundle')
  }

  compiler(
    {
      app,
      serverConfig,
      clientConfig,
      clientCompilerDone,
      serverCompilerDone
    },
    'development'
  )

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

/**
 * prod 服务器渲染 服务
 * @param app Express 实例
 */
export function serverRender(app: Express) {
  const config = getConfig()

  try {
    if (
      config.render &&
      config.render.bundle &&
      config.render.options.clientManifestPath
    ) {
      const bundle = JSON.parse(readFileSync(config.render.bundle, 'utf-8'))
      const template = readFileSync(config.render.options.templatePath, 'utf-8')
      const clientManifest = JSON.parse(
        readFileSync(config.render.options.clientManifestPath, 'utf-8')
      )
      const options = Object.assign(
        {
          ...BASE_RENDER_OPTIONS,
          template,
          clientManifest
        },
        config.render.options
      )

      const renderer = createBundleRenderer(bundle, options)

      const render: any = getRender(renderer, {
        siteInfo: config.siteInfo
      })

      app.use(cookieParser())

      app.get('*', render)
    } else {
      throw new Error('config error, config.render.options.clientManifestPath or config.render.bundle is undefined')
    }
  } catch (error) {
    consola.fatal('config.render', error)
    process.exit(0)
  }
}
