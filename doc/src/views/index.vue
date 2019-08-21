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
import fastblur from '@bestminr/fastblur'

let fastblurWasmModulePromise: Promise<typeof import('@bestminr/fastblur')>
function getFastBlurModule(): Promise<typeof import('@bestminr/fastblur')> {
  return import('@bestminr/fastblur').then((m) => {
    if (fastblurWasmModulePromise) {
      return fastblurWasmModulePromise
    }
    const wasmPath = require('@bestminr/fastblur/fastblur_bg.wasm') // 使用 file-loader 处理的时候是酱紫的
    console.log('got module', m, wasmPath)
    // wasm-bindgen 生成的 js 和 d.ts 不太对... 只好这样强行调 init 函数了
    const initPromise = (m as any).default(wasmPath)
    fastblurWasmModulePromise = initPromise.then(() => {
      return m
    })
    return fastblurWasmModulePromise
  }).catch((err) => {
    console.log('err', err)
  }) as any
}

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
    getFastBlurModule()
  }

  addTestHotLoadingVuex() {
    commit(this.$store, 'SET_testHotLoadingVuex', { number: 1 })
  }
}
</script>