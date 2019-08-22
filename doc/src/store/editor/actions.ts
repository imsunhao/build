import { VUEX_NS, editorHelper as helper, commit } from './index'
import { Tstore } from '@types'

export const actions = helper.makeActions({
  TEST_ACTION(ctx, { id, version }: { id: number } & Pick<Tstore.state, 'version'>) {
    let resove
    const promise = new Promise((res) => resove = res)
    setTimeout(() => {
      console.log('timeout!')
      commit(ctx, 'TEST_VERSION', { version })
      resove()
    }, 1000)
    return promise
  }
})

export default actions

export type TActions = typeof actions

export const dispatch = helper.createDispatch<Tstore.Actions[VUEX_NS]>()