import defineGlobalStore from '@/defineGlobalStore'

const context = defineGlobalStore('test', {
  state: () => ({
    count: 0,
    text: 'hello',
  }),
  getters: {
    getAll() {
      console.log(1)
      return `${this.state.count} ${this.state.text}`
    },
  },
  actions: {
    increment() {
      this.actions.setState('count', this.state.count + 1)
    },
    decrement() {
      this.actions.setState('count', this.state.count - 1)
    },
    setText(text: string) {
      this.actions.setState('text', text)
    },
  },

  persist: 'localStorage',

})

export default context
