import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// Home Page
const HomePage = () => import('../views/index.vue')
const EditorPage = () => import('../views/Editor.vue')
const EditorPage1 = () => import('../views/Editor copy.vue')
const EditorPage2 = () => import('../views/Editor copy 2.vue')
const EditorPage3 = () => import('../views/Editor copy 3.vue')
const EditorPage4 = () => import('../views/Editor copy 4.vue')
const EditorPage5 = () => import('../views/Editor copy 5.vue')
const EditorPage6 = () => import('../views/Editor copy 6.vue')
const EditorPage7 = () => import('../views/Editor copy 7.vue')
const EditorPage8 = () => import('../views/Editor copy 8.vue')
const EditorPage9 = () => import('../views/Editor copy 9.vue')

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
      {
        path: '/editor1',
        component: EditorPage1,
      },
      {
        path: '/editor2',
        component: EditorPage2,
      },
      {
        path: '/editor3',
        component: EditorPage3,
      },
      {
        path: '/editor4',
        component: EditorPage4,
      },
      {
        path: '/editor5',
        component: EditorPage5,
      },
      {
        path: '/editor6',
        component: EditorPage6,
      },
      {
        path: '/editor7',
        component: EditorPage7,
      },
      {
        path: '/editor8',
        component: EditorPage8,
      },
    ],
  })
}
