import useInterval from '@/useInterval'

function CorePage() {
  const { resume, pause, isActive, counter } = useInterval(500)

  onCleanup(() => {
    console.log('cleanup')
  })

  createEffect(() => {
    console.log(counter())
  })

  return (
    <div>
      <div>
        Count:
        {counter()}
      </div>
      <button onClick={() => {
        if (isActive()) {
          pause()
        }
        else {
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
        <button onClick={() => setCorePage(!corePage())}>改变页面</button>
      </div>
    </div>
  )
}
