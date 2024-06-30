import createComponentState from '@/createComponentState'

const ComponentState = createComponentState(() => ({
  count: 0,
}), {
  increase() {
    const { state, actions } = this
    actions.setState('count', state.count + 1)
  },
})

export default ComponentState
