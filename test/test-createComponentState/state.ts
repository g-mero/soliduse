import createComponentState from '@/createComponentState'

const ComponentState = createComponentState({
  state: () => ({
    count: 0,
    test: 'test',
  }),
})

export default ComponentState
