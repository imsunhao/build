import { Tstore, CreateVuex } from '@types'
import { ActionTree, Store, MutationTree, ActionContext, GetterTree } from 'vuex'

export function vuexTypescriptHelper<RootState>() {
  function makeWrapper<State>(namespace: keyof RootState | string[] = ('' as any)) {
    type TActionContext = Store<any> | ActionContext<State, RootState>
    function createGetState() {
      function getState<K extends keyof State>(
        context: TActionContext,
        stateKey: K,
      ): State[K]
      function getState<K extends keyof State, K1 extends keyof State[K]>(
        context: TActionContext,
        stateKey: K,
        state1Key: K1,
      ): State[K][K1]
      function getState<K extends keyof State, K1 extends keyof State[K], K2 extends keyof State[K][K1]>(
        context: TActionContext,
        stateKey: K,
        state1Key: K1,
        state2Key: K2,
      ): State[K][K1][K2]
      function getState<K extends keyof State, K1 extends keyof State[K], K2 extends keyof State[K][K1], K3 extends keyof State[K][K1][K2]>(
        context: TActionContext,
        stateKey: K,
        state1Key: K1,
        state2Key: K2,
        state3Key: K3,
      ): State[K][K1][K2][K3]
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

    type TGetterTree = GetterTree<State, RootState>

    function makeGetters<G extends TGetterTree>(getters: G) {
      return getters
    }

    function createGetterTypeHelper<GT extends TGetterTree>() {
      type GetterTypeHelper = {
        [K in keyof GT]: ReturnType<GT[K]>
      }
      function getterTypeHelper(getters: any) {
        return getters as GetterTypeHelper
      }
      return getterTypeHelper
    }

    function createGetGetters<GT extends TGetterTree>() {
      type Deep<T> = {
        [k in string]: T
      }
      type TGetterTree2 = Deep<GT>
      type TGetterTree3 = Deep<TGetterTree2>

      function getGetters<P extends keyof GT>(
        context: TActionContext,
        path: P,
      ): ReturnType<GT[P]>
      function getGetters<P extends keyof TGetterTree2, P1 extends keyof TGetterTree2[P]>(
        context: TActionContext,
        path: P,
        path1: P1,
      ): ReturnType<TGetterTree2[P][P1]>
      function getGetters<P extends keyof TGetterTree3, P1 extends keyof TGetterTree3[P], P2 extends keyof TGetterTree3[P][P1]>(
        context: TActionContext,
        path: P,
        path1: P1,
        path2: P2,
      ): ReturnType<TGetterTree3[P][P1][P2]>
      function getGetters(context: TActionContext, ...args: any[]): any {
        checkStore(context, { namespace, args })
        if (args.length < 1) {
          console.error('commit args.length must > 1')
          return
        }
        const paths = args.join('/')
        return context.getters[paths]
      }

      return getGetters
    }

    function makeMutations<M extends MutationTree<State>>(mutationTree: M) {
      return mutationTree
    }

    function createCommit<Mutation extends MutationTree<State>>() {
      type MutationPayloadTree = CreateVuex.SniffMutationPayloadTree<State, Mutation>
      function commit<M extends keyof MutationPayloadTree>(
        context: TActionContext,
        mutation: M,
        payload: MutationPayloadTree[M],
      ): void
      function commit<P extends keyof MutationPayloadTree, M extends keyof MutationPayloadTree[P]>(
        context: TActionContext,
        path: P,
        mutation: M,
        payload: CreateVuex.SniffMutationPayloadTree<State, MutationPayloadTree[P]>[M],
      ): void
      function commit<P extends keyof MutationPayloadTree, P1 extends keyof MutationPayloadTree[P], M extends keyof MutationPayloadTree[P][P1]>(
        context: TActionContext,
        path: P,
        path1: P1,
        mutation: M,
        payload: CreateVuex.SniffMutationPayloadTree<State, MutationPayloadTree[P][P1]>[M],
      ): void
      function commit<P extends keyof MutationPayloadTree, P1 extends keyof MutationPayloadTree[P], P2 extends keyof MutationPayloadTree[P][P1], M extends keyof MutationPayloadTree[P][P1][P2]>(
        context: TActionContext,
        path: P,
        path1: P1,
        path2: P2,
        mutation: M,
        payload: CreateVuex.SniffMutationPayloadTree<State, MutationPayloadTree[P][P1][P2]>[M],
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

    type TActionTree = ActionTree<State, RootState>

    function makeActions<A extends TActionTree>(actionTree: A) {
      return actionTree
    }

    function createDispatch<AT extends TActionTree>() {
      type ActionPayloadPathTree = CreateVuex.SniffActionPayloadPathTree<State, AT>
      type ActionPayloadTree = CreateVuex.SniffActionPayloadTree<State, AT>
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
      makeGetters,
      createGetGetters,
      makeMutations,
      createCommit,
      makeActions,
      createDispatch,
      createGetterTypeHelper,
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

  function checkNamespace(namespace: keyof RootState | string[], args: any[]) {
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

  return {
    makeWrapper
  }
}