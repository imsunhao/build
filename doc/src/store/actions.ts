import { globalHelper } from 'src/store/helpers'

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

export const dispatch = globalHelper.createDispatch<typeof actions>()

// const store = this.store

// dispatch(store, 'GET_SERVER_DATA', { id: 1 }).then(({ id }) => {
//   id = 'st'
//   id = 1
// })