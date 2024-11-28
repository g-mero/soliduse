import useIntervalFn from '@/useIntervalFn'
import watch from '@/watch'
import { createSignal } from 'solid-js'
import ComponentState from './state'

function CheckValue() {
  const [state] = ComponentState.useContext()

  watch(() => state.count, (count) => {
    console.log('count:', count)
  })

  return <></>
}

function TestProps(props: {
  count?: number
}) {
  const TestState = ComponentState.initial({
    count: () => props.count,
  })

  const [state, actions] = TestState.value

  return (
    <TestState.Provider>
      <CheckValue />
      <input type="range" value={state.count} onChange={e => actions.setState('count', Number(e.target.value))} />
      <h1>
        {state.count}
        {' '}
        {state.test}
      </h1>
    </TestState.Provider>
  )
}

export default function TestCreateComponentState() {
  const [count, setCount] = createSignal(24)

  useIntervalFn(() => { setCount(count() + 1) }, 1000)
  return (
    <TestProps count={count()} />
  )
}
