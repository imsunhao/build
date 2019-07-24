import Router from 'vue-router'
import { Store } from 'vuex'
import { Tstore } from '@types'
export const VUE_ENV = process.env.VUE_ENV

const isServer = (VUE_ENV === 'server')
const isProduction = (process.env.NODE_ENV === 'production')

export interface HostGlobal extends Window {
  /**
   * Vue SSR 注入 state 信息
   */
  __INITIAL_STATE__: any

  /**
   * 注入 环境 信息
   */
  __INJECT_ENV__: any

  /**
   * 注入 服务器配置信息
   */
  __INJECT_CONTEXT__: any

  /**
   * vuex 实例
   */
  store: Store<Tstore.state>

  /**
   * vue router 实例
   */
  router: Router
}

let hostGlobal: HostGlobal
try {
  hostGlobal = (window as any)

  hostGlobal.__INJECT_ENV__ = hostGlobal.__INJECT_ENV__ || {}
  hostGlobal.__INJECT_CONTEXT__ = hostGlobal.__INJECT_CONTEXT__ || {}
} catch (err) {
  hostGlobal = require('globals')
  hostGlobal.__INJECT_ENV__ = process.env
  hostGlobal.__INJECT_CONTEXT__ = (process as any).__INJECT_CONTEXT__
}

export const injectGlobal: {
  __INJECT_ENV__: {
    ENV: string
    NODE_ENV: string
    SERVER_ENV: string
    VUE_ENV: string
    PUBLIC_PATH: string
    PACKAGE_VERSION: string
    NONCE: string
  },
  __INJECT_CONTEXT__: {
    /**
     * 服务器主机地址
     */
    SERVER_HOST: string,

    /**
     * 静态资源CDN地址
     */
    STATIC_HOST: string,

    /**
     * Content Security Policy 白名单
     */
    CSP?: string,
  },
} = hostGlobal

export {
  isServer,
  isProduction,
  hostGlobal,
}
