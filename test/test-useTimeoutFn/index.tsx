import useTimeoutFn from '@/useTimeoutFn'
import { createSignal } from 'solid-js'

export default function TestUseTimeoutFn() {
  const [finished, setFinished] = createSignal(false)
  const { isPending, start, stop } = useTimeoutFn(() => {
    setFinished(true)
  })

  return (
    <div>
      <h1>{finished() ? '完成' : 'not yet'}</h1>
      <button onClick={() => {
        if (isPending()) {
          stop()
        }
        else {
          start()
          setFinished(false)
        }
      }}
      >
        {isPending() ? '停止' : '启动'}
      </button>
    </div>
  )
}
