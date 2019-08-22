import { globalHelper } from 'src/store/helpers'
import { Tstore } from '@types'

import axios from 'axios'
import { isServer, injectGlobal } from 'src/envs'
import { commit, getState } from 'src/store'

function get(url: string) {
  if (isServer) url = `${injectGlobal.__INJECT_CONTEXT__.SERVER_HOST}${url}`
  console.log('axios 发起请求:', url)
  return axios.get(url)
}

export const actions = globalHelper.makeActions({
  GET_SERVER_DATA(ctx, { id }: { id: number }) {
    let resove
    const promise = new Promise<{ id: number }>((res) => resove = res)
    setTimeout(() => {
      resove({
        id,
      })
    }, 1000)
    return promise
  },
  GET_SERVER_VERSION(ctx) {
    const version = getState(ctx, 'version')
    if (version) {
      console.log('version 已经被请求过了')
      return
    }

    return get('/private/version').then(({ data }) => {
      const version = data.version.join('.')
      console.log('axios 获取当前版本号:', version)
      commit(ctx, 'SET_VERSION', { version })
    })
  }
})

export default actions

export type TActions = typeof actions

export const dispatch = globalHelper.createDispatch<Tstore.Actions>()

// const store = this.store

// dispatch(store, 'GET_SERVER_DATA', { id: 1 }).then(({ id }) => {
//   id = 'st'
//   id = 1
// })

// dispatch(store, 'editor', 'GET_SERVER_DATA', { id: 1 }).then(({ id }) => {
//   id = 'st'
//   id = 1
// })

// dispatch(store, 'editor', 'editor2', 'GET_SERVER_DATA', { id: 1 }).then(({ id }) => {
//   id = 'st'
//   id = 1
// })

// dispatch(store, 'editor', 'editor2', 'editor3', 'GET_SERVER_DATA', { id: 1 }).then(({ id }) => {
//   id = 'st'
//   id = 1
// })