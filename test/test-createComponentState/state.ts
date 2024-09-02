import createComponentState from '@/createComponentState'

const ComponentState = createComponentState(() => ({
  count: 0,
  test: 'test',
}), {
  increase() {
    const { state, actions } = this
    actions.setState('count', state.count + 1)
  },
}, {
  useStorage: { key: 'test-createComponentState' },
})

export default ComponentState
