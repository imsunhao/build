/**
 * 根据路由匹配的页面 中间件
 */
const middlewares = [
  {
    path: '/',
    methods: 'GET',
    handle: (req, res, next) => {
      req.renderContext = {
        serverStore: {
          hello: 'hello word. 这里可用于 使用服务器内存 缓存数据.'
        },
      }
      next()
    },
  },
]

export function middlewaresExtension(app, routerStackManagement) {
  routerStackManagement.update(middlewares)
  console.log('middlewaresExtension init')
}