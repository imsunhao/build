export * from './type'

import actions, { dispatch } from './actions'
import mutations, { commit, getState } from './mutations'
import getters from './getters'
import state from './state'

export default {
  namespaced: true,
  state: state(),
  actions,
  mutations,
  getters,
}

export { commit, getState, dispatch }