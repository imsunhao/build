<template>
<div>
  <h1>serverStore = {{ hello }}</h1>
  <button @click="addTestHotLoadingVuex">点击增加 testHotLoadingVuex = {{testHotLoadingVuex}}</button>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { State } from 'vuex-class'
import { Watch, Prop } from 'vue-property-decorator'

import { Trouter } from '@types'

import { commit, getState } from 'src/store'
import { isServer } from 'src/envs'

@Component({
  components: {},
})
export default class APP extends Vue {

  get hello() {
    // return ''
    return getState(this.$store, 'hello')
  }

  get testHotLoadingVuex() {
    // return ''
    return getState(this.$store, 'testHotLoadingVuex')
  }

  static asyncData({ store, serverStore }: Trouter.asyncData.index) {
    console.log('asyncData', serverStore)
    if (!isServer) {
      console.log('static asyncData 在本地也会被执行一般 但是没有中间件提供数据支撑!')
    }
    if (serverStore && serverStore.hello) {
      commit(store, 'SET_HELLO', serverStore)
    }
  }

  mounted() {
    console.log('init Views')
  }

  addTestHotLoadingVuex() {
    commit(this.$store, 'SET_testHotLoadingVuex', { number: 1 })
  }
}
</script>