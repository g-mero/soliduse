import watch from '@/watch'
import ComponentState from './state'

function CheckValue() {
  const [state,,untrackData] = ComponentState.useContext()

  watch([() => state.doubleCount], ([doubleCount]) => {
    console.log('doubleCount:', doubleCount)
  })

  watch(() => untrackData.untrack, (u) => {
    console.log(u)
  })

  return <></>
}

function TestProps(props: {
  count?: number
  testArray?: string[]
}) {
  const TestState = ComponentState.initial({
    count: () => props.count,
    testArray: () => props.testArray,
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
  return (
    <TestProps count={24} />
  )
}
