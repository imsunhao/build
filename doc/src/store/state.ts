import { Tstore } from '@types'

export default function state(): Tstore.state {
  return {
    isMobile: false,
    version: '',
    hello: '',
    testHotLoadingVuex: 0,
    initialReplaceStateUrl: '',
  }
}
