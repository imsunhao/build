<template>
<div>
  <h1>当前服务器版本为: {{ version }}</h1>
  <h1>serverStore = {{ hello }}</h1>
  <button @click="addTestHotLoadingVuex">点击增加 testHotLoadingVuex = {{testHotLoadingVuex}}</button>
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
      dispatch(store, 'GET_SERVER_VERSION', undefined)
    ])
  },
  setup(props, context) {
    const hello = computed(() => getState(hostGlobal.store, 'hello'))
    const version = computed(() => getState(hostGlobal.store, 'version'))
    const testHotLoadingVuex = computed(() => getState(hostGlobal.store, 'testHotLoadingVuex'))

    onMounted(() => {
      console.log('init Views')
    })

    return {
      hello,
      version,
      testHotLoadingVuex,
      addTestHotLoadingVuex() {
        commit(hostGlobal.store, 'SET_testHotLoadingVuex', { number: 1 })
      }
    }
  },
}
</script>