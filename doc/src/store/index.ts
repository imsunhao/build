import { Tstore } from '@types'

import Vue from 'vue'
import Vuex from 'vuex'
import actions, { dispatch } from './actions'
import mutations, { commit, getState } from './mutations'
import getters from './getters'
import state from './state'
import { isProduction } from 'src/envs'

Vue.use(Vuex)

export function createStore() {
  return new Vuex.Store<Tstore.state>({
    strict: !isProduction,
    state: state(),
    actions,
    mutations,
    getters,
    modules: {},
  })
}

export { commit, getState, dispatch }