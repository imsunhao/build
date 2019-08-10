
import Vue from 'vue'
import { Trouter } from '@types'

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    asyncData?: (this: void, context: Trouter.asyncData) => void
  }
}