import { ConfigOptions, BuildService } from '@types'
import { Express } from 'express'
import { getRender } from 'src/utils/render'
import { createBundleRenderer } from 'vue-server-renderer'
import path from 'path'
import { readFileSync } from 'fs'
import cookieParser from 'cookie-parser'
import { getConfig, BASE_RENDER_OPTIONS } from 'src/utils'
import consola from 'consola'


import { compiler } from 'src-utils-compiler'
import chokidar from 'chokidar'

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
      const clientManifest: any = clientManifestAddDll(
        renderOptions.clientManifest
      )
      render = getRender(
        createBundleRenderer(renderOptions.bundle, {
          ...(BASE_RENDER_OPTIONS as any),
          ...renderConfig,
          template: readFileSync(templatePath, 'utf-8'),
          clientManifest
        }),
        {
          context: config.injectContext
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
  return readyPromise
}

function clientManifestAddDll(clientManifest: any) {
  clientManifest = JSON.parse(JSON.stringify(clientManifest))
  const config = getConfig()
  if (config.webpack && config.webpack.client && config.webpack.client.output)
    if (config.webpack.dll) {
      try {
        const dllManifest = JSON.parse(
          readFileSync(
            path.resolve(
              config.webpack.dll.path,
              './vue-ssr-dll-manifest.json'
            ),
            'utf-8'
          )
        )
        dllManifest.all.forEach((js: string) => {
          clientManifest.all.push('dll/' + js)
        })
        dllManifest.initial.forEach((js: string) => {
          clientManifest.initial.unshift('dll/' + js)
        })
      } catch (error) {
        consola.fatal('clientManifestAddDll', error)
        return process.exit(1)
      }
    }
  return clientManifest
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
      config.render.options.clientManifestPath &&
      config.webpack &&
      config.webpack.client &&
      config.webpack.client.output
    ) {
      const template = readFileSync(config.render.options.templatePath, 'utf-8')
      const clientManifest = clientManifestAddDll(
        JSON.parse(
          readFileSync(config.render.options.clientManifestPath, 'utf-8')
        )
      )

      const STATIC_HOST = config.injectContext ? config.injectContext.STATIC_HOST : ''
      const env = ['SERVER_ENV', 'PUBLIC_PATH'].reduce(function(obj, key) {
        obj[key] = process.env[key]
        return obj
      }, {} as any)

      const publicPath = env.SERVER_ENV !== 'local' ? STATIC_HOST + env.PUBLIC_PATH : env.PUBLIC_PATH

      if (!publicPath) {
        consola.fatal('[serverRender] publicPath is undefined')
        return process.exit(1)
      }

      clientManifest.publicPath = publicPath

      const options = Object.assign(
        {
          ...BASE_RENDER_OPTIONS,
          template,
          clientManifest
        },
        config.render.options
      )

      const renderer = createBundleRenderer(config.render.bundle, options)

      const render: any = getRender(renderer, {
        context: config.injectContext,
        publicPath
      })

      app.use(cookieParser())

      app.get('*', render)
    } else {
      throw new Error(
        'config error, config.render.options.clientManifestPath or config.render.bundle is undefined'
      )
    }
  } catch (error) {
    consola.fatal('config.render', error)
    process.exit(1)
  }
}
