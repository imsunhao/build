<template>
<div id="app">
  <transition name="fade"
    mode="out-in">
    <router-view class="view"></router-view>
  </transition>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { State } from 'vuex-class'
import { Watch, Prop } from 'vue-property-decorator'

import axios from 'axios'
import { isServer, injectGlobal } from 'src/envs'

function get(url: string) {
  if (isServer) url = `${injectGlobal.__INJECT_CONTEXT__.SERVER_HOST}${url}`
  console.log('axios 发起请求:', url)
  axios.get(url).then(({ data }) => {
    console.log('axios 获取当前版本号:', data.version.join('.'))
  })
}

@Component({
  components: {},
})
export default class App extends Vue {
  created() {
    get('/private/version')
  }

  mounted() {
    console.log('init APP')
  }
}
</script>