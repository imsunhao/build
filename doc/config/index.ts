import { ConfigOptions } from '@bestminr/build'

import path from 'path'
import ProdEnv from './prod.env'
import DevEnv from './dev.env'

const STATICS_MAX_AGE = 1000 * 60 * 60 * 24 * 30

function getProxyTable(inject) {
  const { SERVER_HOST } = inject.injectContext
  return {
    '/api': {
      target: SERVER_HOST,
      changeOrigin: true,
    },
    '/websocket': {
      target: SERVER_HOST,
      changeOrigin: true,
      ws: true,
    },
  }
}

/**
 * 获取配置文件
 * @param {*} inject 注入的数据 ConfigOptions.getOptionsInject
 */
export function baseConfig(inject) {
  const { resolve } = inject
  const BUILD_ASSETROOT = resolve('./dist/build')
  const DEV_ASSETROOT = resolve('./dist')

  const BUILD_TEMPLATE_PATH = resolve('./dist/build/dll/index.template.html')
  const DEV_TEMPLATE_PATH = resolve('./dist/dll/index.template.html')
  const { STATIC_HOST } = inject.injectContext

  return {
    public: {
      // useMicroCache: process.env.MICRO_CACHE !== 'false',
    },
    build: {
      env: ProdEnv,
      isProd: true,
      port: 8040,
      assetRoot: BUILD_ASSETROOT,
      localOutputPath: '/dist/build/',
      outputPath: `${STATIC_HOST || ''}/dist/build/`,
      statics: {
        '/service-worker.js': {
          path: resolve('./dist/service-worker.js'),
          maxAge: 0,
        },
        '/manifest.json': {
          path: resolve('./manifest.json'),
          maxAge: 0,
        },
      },
      render: {
        bundle: path.join(BUILD_ASSETROOT, 'vue-ssr-server-bundle.json'),
        options: {
          templatePath: BUILD_TEMPLATE_PATH,
          clientManifestPath: path.join(BUILD_ASSETROOT, 'vue-ssr-client-manifest.json'),
          basedir: BUILD_ASSETROOT,
        },
      },
    },
    dev: {
      env: DevEnv,
      isProd: false,
      port: 8040,
      assetRoot: DEV_ASSETROOT,
      outputPath: '/dist/',
      statics: {
        '/dist': {
          path: resolve('./dist'),
          maxAge: 0,
        },
        '/common-assets': {
          path: resolve('./common-assets'),
          maxAge: 0,
        },
        '/public': {
          path: resolve('./public'),
          maxAge: 0,
        },
        '/service-worker.js': {
          path: resolve('./dist/service-worker.js'),
          maxAge: 0,
        },
        '/manifest.json': {
          path: resolve('./manifest.json'),
          maxAge: 0,
        },
      },
      proxyTable: getProxyTable(inject),
      render: {
        options: {
          basedir: BUILD_ASSETROOT,
          templatePath: DEV_TEMPLATE_PATH,
        },
      },
    },
  }
}

export function getConfig(inject: ConfigOptions.getOptionsInject, opts = {}) {
  const config = baseConfig(inject)
  const { resolve } = inject
  let resultConfig
  if (process.env.NODE_ENV === 'production') {
    resultConfig = Object.assign({}, config.public, config.build, opts)
    if (process.env.SERVER_ENV === 'local') {
      const outputPath = config.build.localOutputPath
      resultConfig.outputPath = outputPath
      inject.injectContext.STATIC_HOST = outputPath
      resultConfig.statics = {
        ...resultConfig.statics,
        '/dist': {
          path: resolve('./dist'),
          maxAge: 0,
        },
        '/common-assets': {
          path: resolve('./common-assets'),
          maxAge: 0,
        },
        [`${outputPath}public`]: {
          path: resolve('./public'),
          maxAge: 0,
        },
      }
      resultConfig.proxyTable = getProxyTable(inject)
    }
  } else {
    resultConfig = Object.assign({}, config.public, config.dev, opts)
  }
  return resultConfig
}
