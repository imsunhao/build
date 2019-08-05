import { Tstore } from '@types'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { vuexTypescriptHelper } from 'src/store/utils'
import { merge } from 'lodash'

const { makeWrapper } = vuexTypescriptHelper<Tstore.state>()

describe('Vux base-utils.spec', () => {
  const defalutTestString = 'defalutTestString'
  const localVue = createLocalVue()

  function getTestState(): Tstore.state['test'] {
    return {
      test: defalutTestString,
      deepTest: {
        test1: defalutTestString,
        test2: 2,
      },
    }
  }

  localVue.use(Vuex)

  const getStore = <T>(options = {}) => {
    return new Vuex.Store<T>(
      merge(
        {
          state: {
            test: getTestState(),
          },
        } as any,
        options,
      ),
    )
  }

  describe('全局测试', () => {
    const globalHelper = makeWrapper<Tstore.state>()
    const mutations = globalHelper.makeMutations({
      SET_set: (state, test: string) => {
        state.test.test = test
      },
    })
    const getState = globalHelper.createGetState()
    const commit = globalHelper.createCommit<typeof mutations>()

    it('commit getState', () => {
      const store = getStore<Tstore.state>({ mutations })
      const testString = 'hi'

      expect(store.state.test.test).toEqual(defalutTestString)

      commit(store, 'SET_set', testString)

      expect(store.state.test.test).toEqual(testString)

      expect(getState(store, 'test', 'test')).toEqual(testString)
    })

    const actions = globalHelper.makeActions({
      action_set(ctx, { test }: { test: string }) {
        commit(ctx, 'SET_set', test)
      },
    })
    const dispatch = globalHelper.createDispatch<typeof actions>()

    it('dispatch', () => {
      const store = getStore<Tstore.state>({ mutations, actions })
      const testString = 'hi'

      expect(store.state.test.test).toEqual(defalutTestString)

      dispatch(store, 'action_set', { test: testString })

      expect(getState(store, 'test', 'test')).toEqual(testString)
    })

    const getters = globalHelper.makeGetters({
      getTest(state, getters, rootState, rootGetters) {
        return state.test.test
      }
    })
    const getGetters = globalHelper.createGetGetters<Tstore.Getters>()

    it('get getter', () => {
      const store = getStore<Tstore.state>({ getters })
      expect(getGetters(store, 'getTest')).toEqual(defalutTestString)
    })
  })

  describe('单模块测试', () => {
    const testHelper = makeWrapper<Tstore.state['test']>('test')
    const mutations = testHelper.makeMutations({
      SET_set: (state, test: string) => {
        state.test = test
      },
    })
    const getState = testHelper.createGetState()
    const commit = testHelper.createCommit<typeof mutations>()

    it('commit getState', () => {
      const store = getStore<Tstore.state>({ state: {}, modules: { test: { namespaced: true, state: getTestState(), mutations }}})
      const testString = 'hi'

      expect(store.state.test.test).toEqual(defalutTestString)

      commit(store, 'SET_set', testString)

      expect(store.state.test.test).toEqual(testString)

      expect(getState(store, 'test')).toEqual(testString)
    })

    const actions = testHelper.makeActions({
      action_set(ctx, { test }: { test: string }) {
        commit(ctx, 'SET_set', test)
      },
    })
    const dispatch = testHelper.createDispatch<typeof actions>()

    it('dispatch', () => {
      const store = getStore<Tstore.state>({ state: {}, modules: { test: { namespaced: true, state: getTestState(), mutations, actions }}})
      const testString = 'hi'

      expect(store.state.test.test).toEqual(defalutTestString)

      dispatch(store, 'action_set', { test: testString })

      expect(getState(store, 'test')).toEqual(testString)
    })

    const getters = testHelper.makeGetters({
      getTest(state, getters, rootState, rootGetters) {
        return state.test
      }
    })
    const getGetters = testHelper.createGetGetters<typeof getters>()

    it('get getter', () => {
      const store = getStore<Tstore.state>({ state: {}, modules: { test: { namespaced: true, state: getTestState(), getters }}})
      expect(getGetters(store, 'getTest')).toEqual(defalutTestString)
    })
  })

  describe('深模块(2层)测试', () => {
    const testHelper = makeWrapper<Tstore.state['test']['deepTest']>(['test', 'deepTest'])
    const mutations = testHelper.makeMutations({
      SET_set: (state, test: string) => {
        state.test1 = test
      },
    })
    const getState = testHelper.createGetState()
    const commit = testHelper.createCommit<typeof mutations>()

    it('commit getState', () => {
      const store = getStore<Tstore.state>({ state: {}, modules: { test: { namespaced: true, state: {}, modules: { deepTest: { namespaced: true, state: getTestState().deepTest, mutations }}}}})
      const testString = 'hi'

      expect(store.state.test.deepTest.test1).toEqual(defalutTestString)

      commit(store, 'SET_set', testString)

      expect(store.state.test.deepTest.test1).toEqual(testString)

      expect(getState(store, 'test1')).toEqual(testString)
    })

    const actions = testHelper.makeActions({
      action_set(ctx, { test }: { test: string }) {
        commit(ctx, 'SET_set', test)
      },
    })
    const dispatch = testHelper.createDispatch<typeof actions>()

    it('dispatch', () => {
      const store = getStore<Tstore.state>({ state: {}, modules: { test: { namespaced: true, state: {}, modules: { deepTest: { namespaced: true, state: getTestState().deepTest, mutations, actions }}}}})
      const testString = 'hi'

      expect(store.state.test.deepTest.test1).toEqual(defalutTestString)

      dispatch(store, 'action_set', { test: testString })

      expect(getState(store, 'test1')).toEqual(testString)
    })

    const getters = testHelper.makeGetters({
      getTest(state, getters, rootState, rootGetters) {
        return state.test1
      }
    })
    const getGetters = testHelper.createGetGetters<typeof getters>()

    it('get getter', () => {
      const store = getStore<Tstore.state>({ state: {}, modules: { test: { namespaced: true, state: {}, modules: { deepTest: { namespaced: true, state: getTestState().deepTest, getters }}}}})
      expect(getGetters(store, 'getTest')).toEqual(defalutTestString)
    })
  })
})
