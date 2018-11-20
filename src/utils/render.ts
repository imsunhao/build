import { Response, NextFunction } from 'express'
import { BuildService } from '@types'
import { BundleRenderer } from 'vue-server-renderer'

import path from 'path'
import { getConfig } from 'src/utils'

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

const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`

export function getRender(
  renderer: BundleRenderer,
  opts: BuildService.getRender.opts
) {
  return function getRender(
    req: BuildService.Request,
    res: Response,
    next: NextFunction
  ) {
    // 一切正常工作的情况下，静态文件的请求会被 nginx 或者 express-static 处理，不应该进到这里
    // 直接返回 404 ，不占用 server-render 的宝贵资源

    if (isStaticResourceUrl(req.url)) {
      return res.status(404).end()
    }

    // if (isRouterExtensionPath(req.url)) {
    //   return next()
    // }

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

    const context = {
      pageInfo: {
        title: '  ', // default title @see util/mixins/index
        keywords: '',
        description: ''
      },
      siteInfo: getConfig().siteInfo || {},
      headers: req.headers,
      url: req.url,
      cookies: req.cookies,
      renderContext: req.renderContext || {}
    }


    console.log('getRender: context =', context)

    renderer.renderToString(context, (err: any, html: string) => {
      if (err) {
        res.send(err)
        // return handleError(err)
      }
      res.end(html)
      next()
    })
  }
}
