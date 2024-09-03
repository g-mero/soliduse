import ComponentState from './state'
import useIntervalFn from '@/useIntervalFn'

export default function TestCreateComponentState() {
  const TestState = ComponentState.initial()
  const [state, actions] = TestState.value

  return (
    <TestState.Provider>
      <input type="range" value={state.count} onChange={e => actions.setState('count', Number(e.target.value))} />
      <h1>
        {state.count}
        {' '}
        {state.test}
      </h1>
    </TestState.Provider>
  )
}
