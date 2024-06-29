import { createGlobalState } from '../../src'

const state = createGlobalState(() => ({ count: 0 }), {
  increase() {
    const [state2, actions] = state
    actions.setState('count', state2.count + 1)
  },
})

function useThisStore() {
  return state
}

export default useThisStore
