<template>
<div>
  <h1>serverStore = {{ hello }}</h1>
  <button @click="addTestHotLoadingVuex">点击增加 testHotLoadingVuex = {{testHotLoadingVuex}}</button>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { commit, getState } from 'src/store'
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
  },
  setup(props, context) {
    const hello = computed(() => getState(hostGlobal.store, 'hello'))
    const testHotLoadingVuex = computed(() => getState(hostGlobal.store, 'testHotLoadingVuex'))

    onMounted(() => {
      console.log('init Views')
    })

    return {
      hello,
      testHotLoadingVuex,
      addTestHotLoadingVuex() {
        commit(hostGlobal.store, 'SET_testHotLoadingVuex', { number: 1 })
      }
    }
  },
}
</script>