import createComponentState from '@/createComponentState'

const ComponentState = createComponentState({
  state: () => ({
    count: 0,
    test: 'test',
    testArray: ['test1', 'test2'],
  }),
  getters: {
    doubleCount() {
      return this.state.count * 2
    },
    testArrayOne() {
      console.log(this.state.testArray)
      return this.state.testArray?.[0]
    },
  },
  methods: {
    setCount(value: number) {
      return value
    },
  },
  nowrapData: () => ({
    untrack: 'untrack',
  }),
})

export default ComponentState
