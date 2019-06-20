import Vue from 'vue'
import Router from 'vue-router'

import Component from 'vue-class-component'
import { isServer } from 'src/envs'

// TODO: 问题: 用 vue-class-component 写的 modal (PreviewModal 等) 需要在引入组件前 register router hooks，但是结果还是没调到
// vue-class-component vue-router hooks
if (!isServer) {
  // console.log('register router hook');
  Component.registerHooks(['beforeRouteEnter', 'beforeRouteUpdate', 'beforeRouteLeave'])
}

Vue.use(Router)

// Home Page
const HomePage = () => import('../views/index.vue')

export function createRouter(store) {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      {
        path: '/',
        component: HomePage,
      },
    ],
  })
}
