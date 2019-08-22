import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// Home Page
const HomePage = () => import('../views/index.vue')
const EditorPage = () => import('../views/Editor.vue')

export function createRouter(store) {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      {
        path: '/',
        name: 'home',
        component: HomePage,
      },
      {
        path: '/editor',
        name: 'editor',
        component: EditorPage,
      },
    ],
  })
}
