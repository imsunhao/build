import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { VuexStoreHelper } from 'src/store/utils'
import { merge } from 'lodash'

/**
 * Test Store
 */
namespace TestStore {
  /**
   * vuex state
   */
  export interface state {

    /**
     * 单元测试使用
     */
    test?: {
      test: string
      testNumber: number
      deepTest: {
        test1: string
        test2: number
      }
    }
  }

  /**
   * vuex getters
   */
  export interface getters {
    globleValue: number
    /**
     * 编辑器
     */
    editor?: {
      test: string
      deepTest: {
        test1: string
        test2: number
      }
    }
  }
}
const { makeWrapper } = new VuexStoreHelper<TestStore.state, TestStore.getters>()
const DEFAULT_TEST_STRING = 'DEFAULT_TEST_STRING'
const DEFAULT_TEST_NUMBER = 1

describe('Vux base-utils.spec', () => {
  const localVue = createLocalVue()

  function getTestState(): TestStore.state['test'] {
    return {
      test: DEFAULT_TEST_STRING,
      testNumber: 0,
      deepTest: {
        test1: DEFAULT_TEST_STRING,
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
    const globalHelper = makeWrapper()
    const mutations = globalHelper.makeMutations({
      SET_set: (state, test: string) => {
        state.test.test = test
      },
    })
    const getters = globalHelper.makeGetters({
      globleValue(state, getters, rootState, rootGetters) {
        return DEFAULT_TEST_NUMBER
      }
    })
    const getState = globalHelper.createGetState()
    const commit = globalHelper.createCommit<typeof mutations>()

    it('getGetter', () => {
      const getGetter = globalHelper.createGetGetter()
      const store = getStore<TestStore.state>({ mutations, getters })
      const value = getGetter(store, 'globleValue')
      expect(value).toEqual(DEFAULT_TEST_NUMBER)
    })

    it('commit getState', () => {
      const store = getStore<TestStore.state>({ mutations })
      const testString = 'hi'

      expect(store.state.test.test).toEqual(DEFAULT_TEST_STRING)

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
      const store = getStore<TestStore.state>({ mutations, actions })
      const testString = 'hi'

      expect(store.state.test.test).toEqual(DEFAULT_TEST_STRING)

      dispatch(store, 'action_set', { test: testString })

      expect(getState(store, 'test', 'test')).toEqual(testString)
    })
  })

  type VUEX_NS_1 = typeof VUEX_NS_1
  const VUEX_NS_1 = 'test'

  describe('单模块测试', () => {
    const testHelper = makeWrapper<TestStore.state[VUEX_NS_1]>(VUEX_NS_1)
    const mutations = testHelper.makeMutations({
      SET_set: (state, test: string) => {
        state.test = test
      },
    })
    const getState = testHelper.createGetState()
    const commit = testHelper.createCommit<typeof mutations>()

    it('commit getState', () => {
      const store = getStore<TestStore.state>({
        state: {},
        modules: { test: { namespaced: true, state: getTestState(), mutations } },
      })
      const testString = 'hi'

      expect(store.state.test.test).toEqual(DEFAULT_TEST_STRING)
      expect(store.state.test.test).toEqual(DEFAULT_TEST_STRING)

      commit(store, 'SET_set', testString)

      expect(store.state.test.test).toEqual(testString)

      expect(getState(store, 'test')).toEqual(testString)
    })

    it('getGetter', () => {
      const getters = testHelper.makeGetters({
        globleValue(state, getters, rootState, rootGetters) {
          return DEFAULT_TEST_NUMBER
        }
      })
      const store = getStore<TestStore.state>({
        state: {},
        modules: { test: { namespaced: true, state: getTestState(), mutations, getters } },
      })
      const getGetter = testHelper.createGetGetter()
      const value = getGetter(store, 'globleValue')
      expect(value).toEqual(DEFAULT_TEST_NUMBER)
    })


    const actions = testHelper.makeActions({
      action_set(ctx, { test }: { test: string }) {
        commit(ctx, 'SET_set', test)
      },
    })
    const dispatch = testHelper.createDispatch<typeof actions>()

    it('dispatch', () => {
      const store = getStore<TestStore.state>({
        state: {},
        modules: { test: { namespaced: true, state: getTestState(), mutations, actions } },
      })
      const testString = 'hi'

      expect(store.state.test.test).toEqual(DEFAULT_TEST_STRING)

      dispatch(store, 'action_set', { test: testString })

      expect(getState(store, 'test')).toEqual(testString)
    })
  })

  type VUEX_NS_1_1 = typeof VUEX_NS_1_1
  const VUEX_NS_1_1 = 'deepTest'
  describe('深模块(2层)测试', () => {
    const testHelper = makeWrapper<TestStore.state[VUEX_NS_1][VUEX_NS_1_1]>([VUEX_NS_1, VUEX_NS_1_1])
    const mutations = testHelper.makeMutations({
      SET_set: (state, test: string) => {
        state.test1 = test
      },
    })
    const getState = testHelper.createGetState()
    const commit = testHelper.createCommit<typeof mutations>()

    it('commit getState', () => {
      const store = getStore<TestStore.state>({
        state: {},
        modules: {
          test: {
            namespaced: true,
            state: {},
            modules: { deepTest: { namespaced: true, state: getTestState().deepTest, mutations } },
          },
        },
      })
      const testString = 'hi'

      expect(store.state.test.deepTest.test1).toEqual(DEFAULT_TEST_STRING)

      commit(store, 'SET_set', testString)

      expect(store.state.test.deepTest.test1).toEqual(testString)

      expect(getState(store, 'test1')).toEqual(testString)
    })

    it('getGetter', () => {
      const getters = testHelper.makeGetters({
        globleValue(state, getters, rootState, rootGetters) {
          return DEFAULT_TEST_NUMBER
        }
      })
      const store = getStore<TestStore.state>({
        state: {},
        modules: {
          test: {
            namespaced: true,
            state: {},
            modules: { deepTest: { namespaced: true, state: getTestState().deepTest, mutations, getters } },
          },
        },
      })
      const getGetter = testHelper.createGetGetter()
      const value = getGetter(store, 'globleValue')
      expect(value).toEqual(DEFAULT_TEST_NUMBER)
    })

    const actions = testHelper.makeActions({
      action_set(ctx, { test }: { test: string }) {
        commit(ctx, 'SET_set', test)
      },
    })
    const dispatch = testHelper.createDispatch<typeof actions>()

    it('dispatch', () => {
      const store = getStore<TestStore.state>({
        state: {},
        modules: {
          test: {
            namespaced: true,
            state: {},
            modules: { deepTest: { namespaced: true, state: getTestState().deepTest, mutations, actions } },
          },
        },
      })
      const testString = 'hi'

      expect(store.state.test.deepTest.test1).toEqual(DEFAULT_TEST_STRING)

      dispatch(store, 'action_set', { test: testString })

      expect(getState(store, 'test1')).toEqual(testString)
    })
  })
})
