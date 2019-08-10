import Vue from 'vue'
import Router from 'vue-router'

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
