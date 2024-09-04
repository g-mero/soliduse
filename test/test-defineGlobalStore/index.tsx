import GlobalStore from './context'
import useIntervalFn from '@/useIntervalFn'

export default function TestDefineGlobalStore() {
  const [state, actions] = GlobalStore

  return (
    <div>
      <input type="range" value={state.count} onChange={e => actions.setState('count', Number(e.target.value))} />
      <h1>
        {state.count}
        {' '}
        {state.text}
        {actions.getAll()}
        {actions.getAll()}
      </h1>
    </div>

  )
}
