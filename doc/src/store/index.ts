import Vue from 'vue'
import Vuex, { ActionContext, Store } from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import state from './state'

import { Tstore } from '@types'

Vue.use(Vuex)

function isStore(context: Store<any>) {
  return 'strict' in context
}

export function createStore() {
  return new Vuex.Store<Tstore.state['global']>({
    state: state(),
    actions,
    mutations,
    getters,
    modules: {},
  })
}

type StoreTypeBounds = { global: any }

function createGetState<T extends StoreTypeBounds>() {
  function getState<K extends keyof T['global']>(
    context: Store<any>,
    state: K,
  ): T['global'][K]
  function getState<NS extends keyof T, K extends keyof T[NS]>(
    context: Store<any>,
    namespace: NS,
    state: K,
  ): T[NS][K]
  function getState(context: Store<any>, ...args: any[]): void {
    let namespace: string, state: string
    if (args.length === 2) {
      namespace = args[0]
      state = args[1]
    } else if (args.length === 1) {
      namespace = 'global'
      state = args[0]
    }

    if (namespace !== 'global') {
      return context.state[namespace][state]
    }
    return context.state[state]
  }

  return getState
}

export const getState = createGetState<Tstore.state>()


function createCommit<T extends StoreTypeBounds>() {
  function commit<K extends keyof T['global']>(
    context: Store<any>,
    mutation: K,
    payload: T['global'][K],
  ): void
  function commit<NS extends keyof T, K extends keyof T[NS]>(
    context: Store<any>,
    namespace: NS,
    mutation: K,
    payload: T[NS][K],
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