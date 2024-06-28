import { createGlobalState } from '../../src'

const state = createGlobalState(() => ({ count: 0 }), {
  increase() {
    state[1].setCount(state[0].count + 1)
  },
})

function useThisStore() {
  return state
}

export default useThisStore
