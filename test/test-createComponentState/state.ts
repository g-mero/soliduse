import createComponentState from '@/createComponentState'

const ComponentState = createComponentState({
  state: () => ({
    count: 0,
    test: 'test',
  }),
  methods: {
    setCount(value: number) {
      return value
    },
  },
})

export default ComponentState
