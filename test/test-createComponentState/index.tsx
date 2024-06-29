import ComponentState from './state'
import useIntervalFn from '@/useIntervalFn'

export default function TestCreateComponentState() {
  const TestState = ComponentState()
  const value = TestState.value
  const [state, actions] = value

  createEffect(() => {
    console.log('state.count', state.count)
  })

  useIntervalFn(() => { actions.increase() }, 1000)
  return (
    <TestState.Provider>
      <h1>{state.count}</h1>
    </TestState.Provider>
  )
}
