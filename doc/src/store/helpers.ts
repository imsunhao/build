import { Tstore } from '@types'
import { vuexTypescriptHelper } from 'src/store/utils'

const { makeWrapper } = vuexTypescriptHelper<Tstore.state>()

export const globalHelper = makeWrapper<Tstore.state>()
export const editorHelper = makeWrapper<Tstore.state['editor']>('editor')

/**
 * 例子 1
 */
// const store = this.store

// const getState = globalHelper.createGetState()

// const deepTest = getState(store, 'editor', 'deepTest')
// const test1 = getState(store, 'editor', 'deepTest', 'test1')
// const test2 = getState(store, 'editor', 'deepTest').test2

/**
 * 例子 2
 */
// const store = this.store
// const getEditorState = editorHelper.createGetState()

// const deepTest = getEditorState(store, 'deepTest')
// const test1 = getEditorState(store, 'deepTest', 'test1')
// const test2 = getEditorState(store, 'deepTest').test2

