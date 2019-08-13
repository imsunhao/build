import { globalHelper } from 'src/store/helpers'
import { Tstore } from '@types'

export const globalGetterTypeHelper = globalHelper.createGetterTypeHelper<Tstore.Getters>()
const getterTypeHelper = globalHelper.createGetterTypeHelper<TGetters>()

export const getters = globalHelper.makeGetters({
  getTest2(state, getters, rootState, rootGetters) {
    return 1
  },
  getTest(state, getters, rootState, rootGetters) {
    // const getters2 = getterTypeHelper(getters)
    const getters2: number = getters.getTest2
    rootGetters = globalGetterTypeHelper(rootGetters)

    return {
      hello: state.hello,
      getTest: getters.getTest,
    }
  }
})

export default getters

export type TGetters = typeof getters

export const getGetters = globalHelper.createGetGetters<Tstore.Getters>()

// const store = this.store

// const value1 = getGetters(store, 'getTest')
// const value2 = getGetters(store, 'editor', 'getTest')