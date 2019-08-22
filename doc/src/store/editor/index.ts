export * from './type'

import Vue from 'vue'
import Vuex from 'vuex'
import actions, { dispatch } from './actions'
import mutations, { commit, getState } from './mutations'
import getters from './getters'
import state from './state'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: state(),
  actions,
  mutations,
  getters,
}

export { commit, getState, dispatch }