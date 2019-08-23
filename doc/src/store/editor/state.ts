import { Tstore } from '@types'

export default function state(): Tstore.state['editor'] {
  return {
    test: 'vuex 初始化 string'
  }
}
