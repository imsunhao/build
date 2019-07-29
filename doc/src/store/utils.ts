import { Tstore, CreateVuex } from '@types'
import { ActionTree, Store, MutationTree, ActionContext } from 'vuex'

export function makeWrapper<T>(namespace: keyof Tstore.state | string[] = ('' as any)) {
  type TActionContext = Store<any> | ActionContext<T, Tstore.state>
  function createGetState() {
    function getState<K extends keyof T>(
      context: TActionContext,
      stateKey: K,
    ): T[K]
    function getState<K extends keyof T, K1 extends keyof T[K]>(
      context: TActionContext,
      stateKey: K,
      state1Key: K1,
    ): T[K][K1]
    function getState<K extends keyof T, K1 extends keyof T[K], K2 extends keyof T[K][K1]>(
      context: TActionContext,
      stateKey: K,
      state1Key: K1,
      state2Key: K2,
    ): T[K][K1][K2]
    function getState<K extends keyof T, K1 extends keyof T[K], K2 extends keyof T[K][K1], K3 extends keyof T[K][K1][K2]>(
      context: TActionContext,
      stateKey: K,
      state1Key: K1,
      state2Key: K2,
      state3Key: K3,
    ): T[K][K1][K2][K3]
    function getState(context: TActionContext, ...args: string[]) {
      checkStore(context, { namespace, args })
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

  function createCommit<Mutation extends MutationTree<T>>() {
    type MutationPayloadTree = CreateVuex.SniffMutationPayloadTree<T, Mutation>
    function commit<M extends keyof MutationPayloadTree>(
      context: TActionContext,
      mutation: M,
      payload: MutationPayloadTree[M],
    ): void
    function commit<P extends keyof MutationPayloadTree, M extends keyof MutationPayloadTree[P]>(
      context: TActionContext,
      path: P,
      mutation: M,
      payload: CreateVuex.SniffMutationPayloadTree<T, MutationPayloadTree[P]>[M],
    ): void
    function commit<P extends keyof MutationPayloadTree, P1 extends keyof MutationPayloadTree[P], M extends keyof MutationPayloadTree[P][P1]>(
      context: TActionContext,
      path: P,
      path1: P1,
      mutation: M,
      payload: CreateVuex.SniffMutationPayloadTree<T, MutationPayloadTree[P][P1]>[M],
    ): void
    function commit<P extends keyof MutationPayloadTree, P1 extends keyof MutationPayloadTree[P], P2 extends keyof MutationPayloadTree[P][P1], M extends keyof MutationPayloadTree[P][P1][P2]>(
      context: TActionContext,
      path: P,
      path1: P1,
      path2: P2,
      mutation: M,
      payload: CreateVuex.SniffMutationPayloadTree<T, MutationPayloadTree[P][P1][P2]>[M],
    ): void
    function commit(context: TActionContext, ...args: any[]) {
      checkStore(context, { namespace, args })
      if (args.length < 2) {
        console.error('commit args.length must > 2')
        return
      }
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

  function createDispatch<AT extends TActionTree>() {
    type ActionPayloadPathTree = CreateVuex.SniffActionPayloadPathTree<T, AT>
    type ActionPayloadTree = CreateVuex.SniffActionPayloadTree<T, AT>
    function dispatch<M extends keyof ActionPayloadTree>(
      context: TActionContext,
      type: M,
      payload: ActionPayloadTree[M]['payload'],
    ): ActionPayloadTree[M]['value']
    function dispatch<P extends keyof ActionPayloadPathTree, M extends keyof ActionPayloadPathTree[P]>(
      context: TActionContext,
      path: P,
      type: M,
      payload: CreateVuex.SniffActionPayloadTree<ActionPayloadPathTree[P], AT>[M]['payload'],
    ): CreateVuex.SniffActionPayloadTree<ActionPayloadPathTree[P], AT>[M]['value']
    function dispatch<P extends keyof ActionPayloadPathTree, P1 extends keyof ActionPayloadPathTree[P], M extends keyof ActionPayloadPathTree[P][P1]>(
      context: TActionContext,
      path: P,
      path1: P1,
      type: M,
      payload: CreateVuex.SniffActionPayloadTree<ActionPayloadPathTree[P], AT>[M]['payload'],
    ): CreateVuex.SniffActionPayloadTree<ActionPayloadPathTree[P], AT>[M]['value']
    function dispatch<P extends keyof ActionPayloadPathTree, P1 extends keyof ActionPayloadPathTree[P], P2 extends keyof ActionPayloadPathTree[P][P1], M extends keyof ActionPayloadPathTree[P][P1][P2]>(
      context: TActionContext,
      path: P,
      path1: P1,
      path2: P2,
      type: M,
      payload: CreateVuex.SniffActionPayloadTree<ActionPayloadPathTree[P], AT>[M]['payload'],
    ): CreateVuex.SniffActionPayloadTree<ActionPayloadPathTree[P], AT>[M]['value']
    function dispatch(context: TActionContext, ...args: any[]): any {
      checkStore(context, { namespace, args })
      if (args.length < 2) {
        console.error('commit args.length must > 2')
        return
      }
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

function checkStore(context: any, { namespace, args }) {
  if (isStore(context)) {
    checkNamespace(namespace, args)
  }
}

function checkNamespace(namespace: keyof Tstore.state | string[], args: any[]) {
  // TODO: 完善深层namespace解析
  if (namespace) {
    if (typeof namespace === 'string') {
      args.unshift(namespace)
    } else {
      namespace = [ ...namespace ]
      namespace.reverse().forEach(key => {
        args.unshift(key)
      })
    }
  }
}