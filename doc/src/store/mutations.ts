import { Tstore } from "@types"

export const mutations: Tstore.TcreateUtils.ModuleMutations<Tstore.state, Tstore.MutationPayloads['global']> = {
  SET_IS_MOBILE: (state, isMobile) => {
    console.log('SET_IS_MOBILE', isMobile)
    state.isMobile = isMobile
  },
}

export default mutations