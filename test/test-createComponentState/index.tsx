import ComponentState from './state'
import useIntervalFn from '@/useIntervalFn'

export default function TestCreateComponentState() {
  const TestState = ComponentState.initial()
  const [state, actions] = TestState.value

  useIntervalFn(() => { actions.increase() }, 1000)
  return (
    <TestState.Provider>
      <h1>{state.count}</h1>
    </TestState.Provider>
  )
}
