import useIntervalFn from '@/useIntervalFn'
import { Show, createSignal, onCleanup } from 'solid-js'

function CorePage() {
  const [count, setCount] = createSignal(0)
  const { resume, pause, isActive } = useIntervalFn(() => {
    setCount(count() + 1)
    console.log('interval')
  }, 1000)

  onCleanup(() => {
    console.log('cleanup')
  })
  return (
    <div>
      <div>
        Count:
        {count()}
      </div>
      <button
        type='button'
        onClick={() => {
          if (isActive()) {
            pause()
          } else {
            resume()
          }
        }}
      >
        {isActive() ? '停止' : '继续'}
      </button>
    </div>
  )
}

function AnotherPage() {
  return (
    <div>
      <h1>Another Page</h1>
    </div>
  )
}

export default function TestUseInterval() {
  const [corePage, setCorePage] = createSignal(true)
  return (
    <div>
      <Show when={corePage()} fallback={<AnotherPage />}>
        <CorePage />
      </Show>
      <div>
        <button type='button' onClick={() => setCorePage(!corePage())}>
          改变页面
        </button>
      </div>
    </div>
  )
}
