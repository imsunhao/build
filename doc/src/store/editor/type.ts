import { Tstore } from '@types'
import { makeWrapper } from 'src/store/helpers'

export const VUEX_NS = 'editor'
export type VUEX_NS = typeof VUEX_NS

export const editorHelper = makeWrapper<Tstore.state[VUEX_NS], Tstore.getters[VUEX_NS]>(VUEX_NS)