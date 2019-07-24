import { Tstore } from '@types'

export default function state(): Tstore.state {
  return {
    isMobile: false,
    hello: '',
    testHotLoadingVuex: 0,
    initialReplaceStateUrl: '',
  }
}
