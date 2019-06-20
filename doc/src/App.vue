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

@Component({
  components: {},
})
export default class App extends Vue {
  mounted() {
    console.log('init APP')
  }
}
</script>