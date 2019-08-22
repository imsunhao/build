<template>
<div>
  <h1>当前客户端版本为: {{ clientVersion }}</h1>
  <h1>当前服务器版本为: {{ serverVersion }}</h1>
  <h1>serverStore = {{ hello }}</h1>
  <p><button @click="addTestHotLoadingVuex">点击增加 testHotLoadingVuex = {{testHotLoadingVuex}}</button></p>
  <p><button @click="refreshServerVersion">重新请求 服务器版本</button></p>
  <p><router-link :to="{ name: 'editor' }"> 跳转到editor页面 </router-link></p>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { commit, getState, dispatch } from 'src/store'
import { isServer, hostGlobal } from 'src/envs'

type AsyncData = Trouter.asyncData.app

export default {
  name: 'index',
  props: {},
  asyncData({ store, serverStore }: AsyncData) {
    console.log('asyncData', serverStore)
    if (!isServer) {
      console.log('static asyncData 在本地也会被执行一般 但是没有中间件提供数据支撑!')
    }
    if (serverStore && serverStore.hello) {
      commit(store, 'SET_HELLO', serverStore)
    }
    return Promise.all([
      dispatch(store, 'GET_SERVER_VERSION', {})
    ])
  },
  setup(props, context) {
    const store = hostGlobal.store

    const hello = computed(() => getState(store, 'hello'))
    const serverVersion = computed(() => getState(store, 'version'))
    const clientVersion = computed(() => hostGlobal.__INJECT_ENV__.PACKAGE_VERSION)
    const testHotLoadingVuex = computed(() => getState(store, 'testHotLoadingVuex'))

    onMounted(() => {
      console.log('init Views')
    })

    return {
      hello,
      serverVersion,
      clientVersion,
      testHotLoadingVuex,
      addTestHotLoadingVuex() {
        commit(store, 'SET_testHotLoadingVuex', { number: 1 })
      },
      refreshServerVersion() {
        dispatch(store, 'GET_SERVER_VERSION', { isForce: true })
      }
    }
  },
}
</script>