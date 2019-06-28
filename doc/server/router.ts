import express from 'express'
import { injectGlobal } from 'src/envs'

const version = injectGlobal.__INJECT_ENV__.PACKAGE_VERSION.split('.')

// TODO 自动解析 RouterExtensionPath
// 这个 routerExtension 热替换后 中间件会变为最后
export function routerExtension(app) {
  const oldMiddlewareIndex = app._router.stack.findIndex(item => {
    return item.name === 'router'
  })

  if (oldMiddlewareIndex !== -1) {
    app._router.stack.splice(oldMiddlewareIndex, 1)
  }

  const router = express.Router()

  // *** 自己编写的-请求中间件

  router.get(`/version`, (req, res) => {
    return res.json({ version })
  })

  // *** end 自己编写的-请求中间件

  app.use('/private', router)
  console.log('routerExtension init')
}
