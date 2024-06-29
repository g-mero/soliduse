import useThisStore from './store'
import useIntervalFn from '@/useIntervalFn'

export default function TestCreateGlobalState() {
  const [state, actions] = useThisStore()

  createEffect(() => {
    console.log('state.count', state.count)
  })

  useIntervalFn(() => { actions.increase() }, 1000)
  return (
    <div>
      <h1>{state.count}</h1>
    </div>
  )
}
