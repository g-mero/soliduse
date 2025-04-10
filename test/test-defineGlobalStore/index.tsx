import { onMount } from 'solid-js'
import GlobalStore from './context'

export default function TestDefineGlobalStore() {
  const [state, actions] = GlobalStore

  onMount(() => {
    console.log('inner')
  })

  return (
    <div>
      <input
        type='range'
        value={state.count}
        onChange={(e) => actions.setState('count', Number(e.target.value))}
      />
      <h1>
        {state.count} {state.text}
        {state.getAll}
        {state.getAll}
      </h1>
    </div>
  )
}
