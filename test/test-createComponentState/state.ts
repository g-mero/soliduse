import createComponentState from '@/createComponentState'

function ComponentState() {
  const p = createComponentState(() => ({
    count: 0,
  }), {
    increase: () => {
      const [state, actions] = p.value
      actions.setState('count', state.count + 1)
    },
  })
  return p
}

export default ComponentState
