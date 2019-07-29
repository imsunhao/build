import { globalHelper } from 'src/store/helpers'
import { Tstore } from '@types'

export const mutations = globalHelper.makeMutations({
  SET_IS_MOBILE: (state, isMobile: boolean) => {
    console.log('SET_IS_MOBILE', isMobile)
    state.isMobile = isMobile
  },
  SET_HELLO: (state, { hello }: { hello: string }) => {
    state.hello = hello
  },
  SET_testHotLoadingVuex: (state, { number }: { number: number }) => {
    state.testHotLoadingVuex += number * 1
  },
})

export default mutations

export type TMutations = typeof mutations

export const commit = globalHelper.createCommit<Tstore.Mutations>()
export const getState = globalHelper.createGetState()

// const store = this.store

// commit(store, 'SET_IS_MOBILE', true)
// commit(store, 'editor', 'SET_IS_MOBILE', true)
// commit(store, 'editor', 'editor2', 'SET_IS_MOBILE', true)
// commit(store, 'editor', 'editor2', 'editor3', 'SET_IS_MOBILE', true)