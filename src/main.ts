export function build() {
  console.log('build')
}

// const express = require('express')

// function createApp(resolve: any) {
//   const app = express()

//   function createRenderer(bundle, options) {
//     // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
//     return createBundleRenderer(
//       bundle,
//       Object.assign(options, {
//         // for component caching
//         cache: LRU({
//           max: 1000,
//           maxAge: 1000 * 60 * 15
//         }),
//         // this is only needed when vue-server-renderer is npm-linked
//         basedir: resolve('./dist'),
//         // recommended for performance
//         runInNewContext: false
//       })
//     )
//   }

//   let renderer
//   let readyPromise
//   const templatePath = resolve('./src/index.template.html')
//   // In development: setup the dev server with watch and hot-reload,
//   // and create a new renderer on bundle / index template update.
//   readyPromise = require('./build/setup-dev-server').setupDevServer(
//     app,
//     templatePath,
//     (bundle, options) => {
//       renderer = createRenderer(bundle, options)
//     }
//   )

//   const serve = (path, cache) =>
//     express.static(resolve(path), {
//       maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
//     })

//   app.use(compression({ threshold: 0 }))
//   app.use('/dist', serve('./dist', true))
//   // app.use('/public', serve('./public', true))
//   // app.use('/manifest.json', serve('./manifest.json', true))
//   app.use('/service-worker.js', serve('./dist/service-worker.js'))

//   // since this app has no user-specific content, every page is micro-cacheable.
//   // if your app involves user-specific content, you need to implement custom
//   // logic to determine whether a request is cacheable based on its url and
//   // headers.
//   // 1-second microcache.
//   // https://www.nginx.com/blog/benefits-of-microcaching-nginx/
//   app.use(microcache.cacheSeconds(1, req => useMicroCache && req.originalUrl))

//   function render(req, res) {
//     const s = Date.now()

//     res.setHeader('Content-Type', 'text/html')
//     res.setHeader('Server', serverInfo)

//     const handleError = err => {
//       if (err.url) {
//         res.redirect(err.url)
//       } else if (err.code === 404) {
//         res.status(404).send('404 | Page Not Found')
//       } else {
//         // Render Error Page or Redirect
//         res.status(500).send('500 | Internal Server Error')
//         console.error(`error during render : ${req.url}`)
//         console.error(err.stack)
//       }
//     }

//     const context = {
//       title: 'Vue HN 2.0', // default title
//       url: req.url
//     }
//     renderer.renderToString(context, (err, html) => {
//       if (err) {
//         return handleError(err)
//       }
//       res.send(html)
//       if (!isProd) {
//         console.log(`whole request: ${Date.now() - s}ms`)
//       }
//     })

//     app.get(
//       '*',
//       isProd
//         ? render
//         : (req, res) => {
//             readyPromise.then(() => render(req, res))
//           }
//     )

//     const port = process.env.PORT || 8080
//     app.listen(port, () => {
//       console.log(`server started at localhost:${port}`)
//     })
//   }
// }
