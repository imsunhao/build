import { ActionTree, Store, MutationTree, ActionContext } from 'vuex'

export class VuexHelper<GlobalStates, GlobalGetters> {
  makeWrapper<T, G extends { [k in string]: any }>(namespace: keyof GlobalStates | string[] = ('' as any)) {
    type SniffMutationPayload<T> = T extends (state: any, payload: infer P) => any ? P : T
    type SniffMutationPayloadTree<S, M extends MutationTree<S>> = { [K in keyof M]: SniffMutationPayload<M[K]> }
    type SniffActionPayload<T> = T extends (state: any, payload: infer P) => infer V
      ? { payload: P; value: V }
      : { payload: unknown; value: unknown }
    type SniffActionPayloadTree<S, M extends ActionTree<S, GlobalStates>> = { [K in keyof M]: SniffActionPayload<M[K]> }
    type SniffActionPayloadPathTree<S, M extends ActionTree<S, GlobalStates>> = {
      [K in keyof M]: SniffMutationPayload<M[K]>
    }
    type TActionContext = Store<any> | ActionContext<T, GlobalStates>
    type GetterTree = {
      [K in keyof G]: (state: T, getters: G, rootState: GlobalStates, rootGetters: GlobalGetters) => G[K]
    }

    const GetterTree: GetterTree = undefined as any

    function createGetState() {
      function getState<P extends keyof T>(
        context: TActionContext,
        path: P,
      ): T[P]
      function getState<P extends keyof T, P1 extends keyof T[P]>(
        context: TActionContext,
        path: P,
        path1: P1,
      ): T[P][P1]
      function getState<P extends keyof T, P1 extends keyof T[P], P2 extends keyof T[P][P1]>(
        context: TActionContext,
        path: P,
        path1: P1,
        path2: P2,
      ): T[P][P1][P2]
      function getState<P extends keyof T, P1 extends keyof T[P], P2 extends keyof T[P][P1], P3 extends keyof T[P][P1][P2]>(
        context: TActionContext,
        path: P,
        path1: P1,
        path2: P2,
        path3: P3,
      ): T[P][P1][P2][P3]
      function getState(context: TActionContext, ...args: string[]) {
        this.checkStore(context, { namespace, args })
        let result
        for (let index = 0; index < args.length; index++) {
          const key = args[index]
          if (!result) result = context.state[key]
          else result = result[key]
          if (!result) return
        }
        return result
      }
      return getState
    }

    function createGetGetter() {
      function getGetter<P extends keyof G>(
        context: TActionContext,
        path: P,
      ): G[P]
      function getGetter<P extends keyof G, P1 extends keyof G[P]>(
        context: TActionContext,
        path: P,
        path1: P1,
      ): G[P][P1]
      function getGetter<P extends keyof G, P1 extends keyof G[P], P2 extends keyof G[P][P1]>(
        context: TActionContext,
        path: P,
        path1: P1,
        path2: P2,
      ): G[P][P1][P2]
      function getGetter<P extends keyof G, P1 extends keyof G[P], P2 extends keyof G[P][P1], P3 extends keyof G[P][P1][P2]>(
        context: TActionContext,
        path: P,
        path1: P1,
        path2: P2,
        path3: P3,
      ): G[P][P1][P2][P3]
      function getGetter(context: TActionContext, ...args: string[]) {
        this.checkStore(context, { namespace, args })
        let result
        for (let index = 0; index < args.length; index++) {
          const key = args[index]
          if (!result) result = context.getters[key]
          else result = result[key]
          if (!result) return
        }
        return result
      }
      return getGetter
    }

    function makeMutations<M extends MutationTree<T>>(mutationTree: M) {
      return mutationTree
    }

    function createCommit<Mutation extends MutationTree<T>>() {
      type MutationPayloadTree = SniffMutationPayloadTree<T, Mutation>
      function commit<M extends keyof MutationPayloadTree>(
        context: TActionContext,
        mutation: M,
        payload: MutationPayloadTree[M],
      ): void
      function commit<P extends keyof MutationPayloadTree, M extends keyof MutationPayloadTree[P]>(
        context: TActionContext,
        path: P,
        mutation: M,
        payload: SniffMutationPayloadTree<T, MutationPayloadTree[P]>[M],
      ): void
      function commit<P extends keyof MutationPayloadTree, P1 extends keyof MutationPayloadTree[P], M extends keyof MutationPayloadTree[P][P1]>(
        context: TActionContext,
        path: P,
        path1: P1,
        mutation: M,
        payload: SniffMutationPayloadTree<T, MutationPayloadTree[P][P1]>[M],
      ): void
      function commit<P extends keyof MutationPayloadTree, P1 extends keyof MutationPayloadTree[P], P2 extends keyof MutationPayloadTree[P][P1], M extends keyof MutationPayloadTree[P][P1][P2]>(
        context: TActionContext,
        path: P,
        path1: P1,
        path2: P2,
        mutation: M,
        payload: SniffMutationPayloadTree<T, MutationPayloadTree[P][P1][P2]>[M],
      ): void
      function commit(context: TActionContext, ...args: any[]) {
        this.checkStore(context, { namespace, args })
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

    type TActionTree = ActionTree<T, GlobalStates>

    function makeActions<A extends TActionTree>(actionTree: A) {
      return actionTree
    }

    function createDispatch<AT extends TActionTree>() {
      type ActionPayloadPathTree = SniffActionPayloadPathTree<T, AT>
      type ActionPayloadTree = SniffActionPayloadTree<T, AT>
      function dispatch<M extends keyof ActionPayloadTree>(
        context: TActionContext,
        type: M,
        payload: ActionPayloadTree[M]['payload'],
      ): ActionPayloadTree[M]['value']
      function dispatch<P extends keyof ActionPayloadPathTree, M extends keyof ActionPayloadPathTree[P]>(
        context: TActionContext,
        path: P,
        type: M,
        payload: SniffActionPayloadTree<ActionPayloadPathTree[P], AT>[M]['payload'],
      ): SniffActionPayloadTree<ActionPayloadPathTree[P], AT>[M]['value']
      function dispatch<P extends keyof ActionPayloadPathTree, P1 extends keyof ActionPayloadPathTree[P], M extends keyof ActionPayloadPathTree[P][P1]>(
        context: TActionContext,
        path: P,
        path1: P1,
        type: M,
        payload: SniffActionPayloadTree<ActionPayloadPathTree[P], AT>[M]['payload'],
      ): SniffActionPayloadTree<ActionPayloadPathTree[P], AT>[M]['value']
      function dispatch<P extends keyof ActionPayloadPathTree, P1 extends keyof ActionPayloadPathTree[P], P2 extends keyof ActionPayloadPathTree[P][P1], M extends keyof ActionPayloadPathTree[P][P1][P2]>(
        context: TActionContext,
        path: P,
        path1: P1,
        path2: P2,
        type: M,
        payload: SniffActionPayloadTree<ActionPayloadPathTree[P], AT>[M]['payload'],
      ): SniffActionPayloadTree<ActionPayloadPathTree[P], AT>[M]['value']
      function dispatch(context: TActionContext, ...args: any[]): any {
        this.checkStore(context, { namespace, args })
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
      GetterTree,
      createGetState,
      createGetGetter,
      makeMutations,
      createCommit,
      makeActions,
      createDispatch,
    }
  }

  private isStore(context: Store<any>) {
    return 'strict' in context
  }

  protected checkStore(context: any, { namespace, args }) {
    if (this.isStore(context)) {
      this.checkNamespace(namespace, args)
    }
  }

  protected checkNamespace(namespace: keyof GlobalStates | string[], args: any[]) {
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
}