import { VUEX_NS, editorHelper as helper } from './index'
import { Tstore } from '@types'

export const mutations = helper.makeMutations({
  TEST_VERSION: (state, { version }: Pick<Tstore.state, 'version'>) => {
    state.test = version
  },
})

export default mutations

export type TMutations = typeof mutations

export const commit = helper.createCommit<Tstore.Mutations[VUEX_NS]>()
export const getState = helper.createGetState()