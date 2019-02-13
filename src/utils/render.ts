import { Response, NextFunction } from 'express'
import { BuildService } from '@types'
import { BundleRenderer } from 'vue-server-renderer'

import path from 'path'
import { getConfig } from 'src/utils'
import consola from 'consola'
import serialize from 'serialize-javascript'
import { randomStringAsBase64Url } from './random'

function isStaticResourceUrl(url: string) {
  const ext = path.extname(url)
  const staticFileExts = getConfig().staticFileExts || []
  return ext && staticFileExts.indexOf(ext) > -1
}

function redirectTo404(res: Response, req: BuildService.Request) {
  const errorPageUrl = `/404?reqUrl=${encodeURIComponent(req.url)}`
  res.redirect(errorPageUrl)
}

function makeLoginPageUrl(toPath: string) {
  const newUrl = `/login?toPath=${encodeURIComponent(toPath)}`
  return newUrl
}

function getWindowEnv(renderEnv: string[]) {
  const env = renderEnv.reduce(function(obj: any, key) {
    obj[key] = process.env[key]
    return obj
  }, {})
  env.VUE_ENV = 'client'
  return serialize(env, { isJSON: true })
}

function getContextHead(
  req: BuildService.Request,
  injectContext: any,
  nonce: string
) {
  if (!req.renderEnv) {
    consola.fatal('req.renderEnv is undefined')
    return ''
  }

  const env = ['NODE_ENV'].reduce(function(obj: any, key) {
    obj[key] = process.env[key]
    return obj
  }, {})

  const autoRemove =
    env.NODE_ENV === 'production'
      ? ';(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());'
      : ''
  const nonceStr = nonce ? `nonce="${nonce}"` : ''
  return `<script ${nonceStr}>window.__INJECT_ENV__ = ${getWindowEnv(
    req.renderEnv
  )};window.__INJECT_CONTEXT__ = ${serialize(injectContext, {
    isJSON: true
  })}${autoRemove}</script>`
}

const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${
    require('vue-server-renderer/package.json').version
  } ` +
  `@bestminr/build/${require('../../package.json').version} `

export function getRender(
  renderer: BundleRenderer,
  opts: BuildService.getRender.opts
) {
  return function getRender(
    req: BuildService.Request,
    res: Response,
    next: NextFunction
  ) {
    // const webpack = getConfig().webpack
    // const mode = webpack ? webpack.mode : undefined
    // const isProduction = mode ? mode !== 'development' : true
    // if (!isProduction) consola.log(req.url)

    // 一切正常工作的情况下，静态文件的请求会被 nginx 或者 express-static 处理，不应该进到这里
    // 直接返回 404 ，不占用 server-render 的宝贵资源
    if (isStaticResourceUrl(req.url)) {
      return res.status(404).end()
    }

    // TODO 自动解析 RouterExtensionPath
    if (/^\/private/.test(req.url)) {
      return next()
    }

    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Server', serverInfo)

    const handleError = (err: any) => {
      if (err.url) {
        res.redirect(err.url)
      } else if (err.code === 404) {
        redirectTo404(res, req)
      } else {
        if (err.response) {
          console.error(`error requesting : ${err.xhr.config.url}`)
          console.error('err.response.data', err.response.data)
        } else {
          console.error(`error thrown during render`)
          console.error(err.stack)
        }
        const statusCode = err.statusCode
        if (statusCode === 401) {
          res.redirect(makeLoginPageUrl(req.url))
        } else {
          redirectTo404(res, req)
        }
      }
    }

    const nonce = randomStringAsBase64Url(12)

    const context = {
      ...opts.context,
      pageInfo: {
        title: '  ', // default title @see util/mixins/index
        keywords: '',
        description: ''
      },
      nonce,
      headers: req.headers,
      url: req.url,
      cookies: req.cookies,
      injectContext: req.injectContext || {},
      head: getContextHead(req, opts.context, nonce)
    }

    renderer.renderToString(context, (err: any, html: string) => {
      if (err) {
        return handleError(err)
      }
      res.end(html)
      next()
    })
  }
}
