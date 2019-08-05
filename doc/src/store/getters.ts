import { globalHelper } from 'src/store/helpers'
import { Tstore } from '@types'

export const getters = globalHelper.makeGetters({
  getTest(state, getters, rootState, rootGetters) {
    return state.hello
  }
})

export default getters

export type TGetters = typeof getters

export const getGetters = globalHelper.createGetGetters<Tstore.Getters>()

// const store = this.store

// const value1 = getGetters(store, 'getTest')
// const value2 = getGetters(store, 'editor', 'getTest')