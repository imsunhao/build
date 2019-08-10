<template>
  <div id="app">
    <transition name="fade"
      mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

export default {
  name: 'App',
  setup() {
    onMounted(() => {
      console.log(`mounted`)
    })
    return {}
  },
}
</script>