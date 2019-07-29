import { globalHelper } from 'src/store/helpers'
import { Tstore } from '@types'

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