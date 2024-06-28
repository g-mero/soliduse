import useThisStore from './store'
import useIntervalFn from '@/useIntervalFn'

export default function TestCreateGlobalState() {
  const [{ count }, actions] = useThisStore()

  createEffect(() => {
    console.log('state.count', count)
  })

  useIntervalFn(() => { actions.increase() }, 1000)
  return (
    <div>
      <h1>{count}</h1>
    </div>
  )
}
