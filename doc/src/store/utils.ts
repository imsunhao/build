import { Tstore } from '@types'
import { ActionTree, Store, MutationTree } from 'vuex'

export type SniffMutationPayload<T> = T extends (state: any, payload: infer P) => any ? P: unknown
export type SniffMutationPayloadTree<S, M extends MutationTree<S>> = {
  [K in keyof M]: SniffMutationPayload<M[K]>
}

export type SniffActionPayload<T> = T extends (state: any, payload: infer P) => infer V ? { payload: P, value: V }: { payload: unknown, value: unknown }
export type SniffActionPayloadTree<S, M extends ActionTree<S, any>> = {
  [K in keyof M]: SniffActionPayload<M[K]>
}

export function makeWrapper<T>(namespace: keyof Tstore.state = ('' as any)) {

  function createGetState() {
    function getState<K extends keyof T>(
      context: Store<any>,
      stateKey: K,
    ): T[K]
    function getState<K extends keyof T, K1 extends keyof T[K]>(
      context: Store<any>,
      stateKey: K,
      state1Key: K1,
    ): T[K][K1]
    function getState<K extends keyof T, K1 extends keyof T[K], K2 extends keyof T[K][K1]>(
      context: Store<any>,
      stateKey: K,
      state1Key: K1,
      state2Key: K2,
    ): T[K][K1][K2]
    function getState<K extends keyof T, K1 extends keyof T[K], K2 extends keyof T[K][K1], K3 extends keyof T[K][K1][K2]>(
      context: Store<any>,
      stateKey: K,
      state1Key: K1,
      state2Key: K2,
      state3Key: K3,
    ): T[K][K1][K2][K3]
    function getState(context: Store<any>, ...args: string[]) {
      if (!checkStore(context)) return
      checkNamespace(namespace, args)
      let result
      for (let index = 0; index < args.length; index++) {
        const key = args[index];
        if (!result) result = context.state[key]
        else result = result[key]
        if (!result) return
      }
      return result
    }
    return getState
  }

  function makeMutations<M extends MutationTree<T>>(mutationTree: M) {
    return mutationTree
  }

  function createCommit<M extends MutationTree<T>>() {
    type MutationPayloadTree = SniffMutationPayloadTree<T, M>
    function commit<M extends keyof MutationPayloadTree>(
      context: Store<any>,
      mutation: M,
      payload: MutationPayloadTree[M],
    ): void
    function commit<P extends keyof MutationPayloadTree, M extends keyof MutationPayloadTree[P]>(
      context: Store<any>,
      path: P,
      mutation: M,
      payload: MutationPayloadTree[P][M],
    ): void
    function commit<P extends keyof MutationPayloadTree, P1 extends keyof MutationPayloadTree[P], M extends keyof MutationPayloadTree[P][P1]>(
      context: Store<any>,
      path: P,
      path1: P1,
      mutation: M,
      payload: MutationPayloadTree[P][P1][M],
    ): void
    function commit<P extends keyof MutationPayloadTree, P1 extends keyof MutationPayloadTree[P], P2 extends keyof MutationPayloadTree[P][P1], M extends keyof MutationPayloadTree[P][P1][P2]>(
      context: Store<any>,
      path: P,
      path1: P1,
      path2: P2,
      mutation: M,
      payload: MutationPayloadTree[P][P1][P2][M],
    ): void
    function commit(context: Store<any>, ...args: any[]) {
      if (!checkStore(context)) return
      if (args.length < 2) {
        console.error('commit args.length must > 2')
        return
      }
      checkNamespace(namespace, args)
      const payload = args.pop()
      const paths = args.join('/')
      return context.commit(paths, payload)
    }

    return commit
  }

  type TActionTree = ActionTree<T, Tstore.state>

  function makeActions<A extends TActionTree>(actionTree: A) {
    return actionTree
  }

  function createDispatch<M extends TActionTree>() {
    type actionPayloadTree = SniffActionPayloadTree<T, M>
    function dispatch<M extends keyof actionPayloadTree>(
      context: Store<any>,
      type: M,
      payload: actionPayloadTree[M]['payload'],
    ): actionPayloadTree[M]['value']
    function dispatch(context: Store<any>, ...args: any[]): any {
      if (!checkStore(context)) return
      if (args.length < 2) {
        console.error('commit args.length must > 2')
        return
      }
      checkNamespace(namespace, args)
      const payload = args.pop()
      const paths = args.join('/')
      return context.dispatch(paths, payload)
    }

    return dispatch
  }

  return {
    createGetState,
    makeMutations,
    createCommit,
    makeActions,
    createDispatch,
  }
}

function isStore(context: Store<any>) {
  return 'strict' in context
}

function checkStore(context: Store<any>) {
  if (!isStore(context)) {
    console.error('checkStore context is not a vuex store!', context)
    return false
  }
  return true
}

function checkNamespace(namespace: keyof Tstore.state, args: any[]) {
  if (namespace) {
    args.unshift(namespace)
  }
}