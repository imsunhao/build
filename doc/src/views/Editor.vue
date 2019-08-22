<template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { commit, getState, dispatch } from 'src/store'
import { isServer, hostGlobal } from 'src/envs'

export default {
  name: 'Editor',
  props: {},
  setup(props, context) {
    const hello = computed(() => getState(hostGlobal.store, 'hello'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      hello,
    }
  },
}
</script>