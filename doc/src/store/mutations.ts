import { Tstore } from "@types"

export const mutations: Tstore.createUtils.ModuleMutations<Tstore.state['global'], Tstore.MutationPayloads['global']> = {
  SET_IS_MOBILE: (state, isMobile) => {
    console.log('SET_IS_MOBILE', isMobile)
    state.isMobile = isMobile
  },
  SET_HELLO: (state, { hello }) => {
    state.hello = hello
  },
  SET_testHotLoadingVuex: (state, { number }) => {
    state.testHotLoadingVuex += number * 1
  },
}

export default mutations