import Vue from 'vue'
import Vuex, { ActionContext, Store } from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import state from './state'

import { Tstore } from '@types'

Vue.use(Vuex)

function isStore(context: any) {
  return 'strict' in context
}

export function createStore() {
  return new Vuex.Store<Tstore.state>({
    state: state(),
    actions,
    mutations,
    getters,
    modules: {},
  })
}

type createMutationPayloads = { global: any }

function createCommit<MutationPayloads extends createMutationPayloads>() {
  function commit<K extends keyof MutationPayloads['global']>(
    context: Store<any>,
    mutation: K,
    payload: MutationPayloads['global'][K],
  ): void
  function commit<NS extends keyof MutationPayloads, K extends keyof MutationPayloads[NS]>(
    context: Store<any>,
    namespace: NS,
    mutation: K,
    payload: MutationPayloads[NS][K],
  ): void
  function commit(context: Store<any>, ...args: any[]): void {
    let namespace: string, mutation: string, payload: any
    if (args.length === 3) {
      namespace = args[0]
      mutation = args[1]
      payload = args[2]
    } else if (args.length === 2) {
      namespace = 'global'
      mutation = args[0]
      payload = args[1]
    }

    if (namespace !== 'global' && isStore(context)) {
      mutation = `${namespace}/${mutation}`
    }
    return context.commit(mutation, payload)
  }

  return commit
}

export const commit = createCommit<Tstore.MutationPayloads>()
// const store = this.store

// commit(store, 'SET_IS_MOBILE', false)
// commit(store, 'editor', 'test', undefined)