import { Tstore } from '@types'

export default function state(): Tstore.state {
  return {
    isMobile: false,
    initialReplaceStateUrl: '',
  }
}
