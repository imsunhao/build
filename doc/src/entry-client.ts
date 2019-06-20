/* global navigator:false */
import './publicPath'

import Vue from 'vue'
import 'es6-promise/auto'
import { createApp } from './app'
import { hostGlobal, isProduction } from 'src/envs'

import { callComponentsHookWith, getHookFromComponent } from 'src/router/router-util'

Vue.config.performance = !isProduction
Vue.config.devtools = !isProduction

if (hostGlobal.__INITIAL_STATE__) {
  // replaceState 需要发生在 router 创建前
  const _state = hostGlobal.__INITIAL_STATE__
  const redirectUrl = _state.initialReplaceStateUrl
  if (redirectUrl) {
    console.log('initialReplaceStateUrl', redirectUrl)
    try {
      history.replaceState(null, null, redirectUrl)
    } catch (err) {
      window.location = redirectUrl
    }
  }
}

const { app, router, store } = createApp()

hostGlobal.store = store // for debug for browserDetection
hostGlobal.router = router // use for browserDetection

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (hostGlobal.__INITIAL_STATE__) {
  console.log('replace initial state')
  store.replaceState(hostGlobal.__INITIAL_STATE__)
}

router.beforeEach((to, from, next) => {
  const route = to.matched.find(r => r.meta.redirectOnMobile)
  if (route && store.state.isMobile) {
    const path = to.path
    next({
      path: '/m' + path,
    })
  } else {
    next()
  }
})

// wait until router has resolved all async before hooks
// and async components...
router.onReady(initialRoute => {
  const initialMatched = router.getMatchedComponents(initialRoute)
  callComponentsHookWith(initialMatched, 'asyncData', {
    store,
    stage: 'client-onReady',
    route: initialRoute,
    componentName: getHookFromComponent(initialMatched[initialMatched.length - 1], 'name'),
  })

  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  router.beforeResolve((to, from, next) => {
    const matchedComponent = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const activated = matchedComponent.filter((c, i) => {
      return diffed || (diffed = prevMatched[i] !== c)
    })

    const componentsHookOptions = {
      store,
      route: to,
      stage: 'client-beforeResolve',
      componentName: getHookFromComponent(matchedComponent, 'name'),
    }

    const asyncDataResults = callComponentsHookWith(activated, 'asyncData', componentsHookOptions)

    Promise.all(asyncDataResults)
      .then(() => {
        next()
      })
      .catch(next)
  })

  // actually mount to DOM
  app.$mount('#app')
})
