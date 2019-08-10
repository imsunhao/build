import { createApp } from './app'
import { callComponentsHookWith } from 'src/router/router-util'
import { isProduction, hostGlobal } from 'src/envs'

function isMobileUA(ua) {
  // 自己实现吧
  console.log(ua)
  return false
}

function isMobilePageUrl(url) {
  return /\/m\//.test(url)
}

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default context => {
  // hostGlobal.__INJECT_CONTEXT__ = context
  // console.log('server url = ', context.url, ' server context.injectContext.middlewaresContent = ', context.injectContext.middlewaresContent)

  return new Promise((resolve, reject) => {
    const s = !isProduction && Date.now()
    const { url, cookies, headers } = context

    const isMobile = isMobileUA(headers['user-agent'])

    const { app, router, store } = createApp()

    hostGlobal.store = store

    store.commit('SET_IS_MOBILE', isMobile)

    const route = router.resolve(url).route
    const fullPath = route.fullPath

    if (fullPath !== url) {
      return reject({ url: fullPath })
    }

    let finalUrl = url

    const meta = route.meta

    if (headers && meta && meta.redirectOnMobile) {
      if (isMobile) {
        if (!isMobilePageUrl(url)) {
          finalUrl = `/m${url}`
          store.state.initialReplaceStateUrl = finalUrl
        }
      }
    }

    // set router's location
    router.push(finalUrl)

    // wait until router has resolved possible async hooks
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // no matched routes
      if (!matchedComponents.length) {
        // console.log('no matched', finalUrl)
        return reject({ code: 404 })
      }

      // 加上 try/catch 避免此 block 内抛出的错误造成 promise unhandledRejection
      try {
        const callComponentsHookWithOptions = Object.assign({
          store,
          route: router.currentRoute,
          cookies,
          stage: 'server-onReady',
          matchedComponents,
        }, context.injectContext.middlewaresContent)

        const asyncDataResults = callComponentsHookWith(matchedComponents, 'asyncData', callComponentsHookWithOptions)
        // Call fetchData hooks on components matched by the route.
        // A preFetch hook dispatches a store action and returns a Promise,
        // which is resolved when the action is complete and store state has been
        // updated.
        Promise.all(asyncDataResults).then(() => {
          console.log(`data pre-fetch: ${Date.now() - s}ms. -> ${router.currentRoute.path}`)
          // After all preFetch hooks are resolved, our store is now
          // filled with the state needed to render the app.
          // Expose the state on the render context, and let the request handler
          // inline the state in the HTML response. This allows the client-side
          // store to pick-up the server-side state without having to duplicate
          // the initial data fetching on the client.
          context.state = store.state
          resolve(app)
        }).catch(reject)

      } catch(err) {
        reject(err)
      }
    }, reject)
  })
}
