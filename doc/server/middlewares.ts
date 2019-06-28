import { utils } from '@bestminr/build'

/**
 * 根据路由匹配的页面 中间件
 */
const middlewares = [
  {
    path: '/',
    methods: 'GET',
    handle: (req, res, next) => {
      req.injectContext = {
        middlewaresContent: {
          serverStore: {
            hello: 'hello word. 这里可用于 使用服务器内存 缓存数据.'
          },
        }
      }
      console.log('调用了', req.injectContext)
      next()
    },
  },
]

export function middlewaresExtension(app, routerStackManagement: utils.RouterStackManagement) {
  routerStackManagement.update(middlewares)
  console.log('middlewaresExtension init')
}