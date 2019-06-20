<template>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { State } from 'vuex-class'
import { Watch, Prop } from 'vue-property-decorator'

import { Trouter } from '@types'

@Component({
  components: {},
})
export default class APP extends Vue {
  static asyncData({ store, serverStore }: Trouter.asyncData.index) {
    console.log(serverStore)
  }
  mounted() {
    console.log('init Views')
  }
}
</script>