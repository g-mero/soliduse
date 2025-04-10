import { useEventListener } from '@/useEventListener'
import { Show, createSignal } from 'solid-js'

function CorePage() {
  useEventListener(document, 'click', () => {
    console.log('click')
  })
  return (
    <div>
      <h1>CorePage</h1>
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

export default function TestUseEventListener() {
  const [show, setShow] = createSignal(true)
  return (
    <div>
      <Show when={show()} fallback={<AnotherPage />}>
        <CorePage />
      </Show>
      <div>
        <button type='button' onClick={() => setShow(!show())}>
          改变页面
        </button>
      </div>
    </div>
  )
}
