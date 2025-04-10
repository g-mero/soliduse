import type { Stoppable } from '@/utils/types'
import { createSignal, onCleanup } from 'solid-js'

export default function useTimeoutFn(cb: () => void, timeout = 500): Stoppable {
  const [isPending, setIsPending] = createSignal(false)
  let timer: number

  const start = () => {
    if (isPending()) return
    setIsPending(true)
    timer = setTimeout(() => {
      cb()
      setIsPending(false)
    }, timeout)
  }

  const stop = () => {
    clearTimeout(timer)
    setIsPending(false)
  }

  onCleanup(() => {
    stop()
  })

  start()

  return {
    isPending,
    start,
    stop,
  }
}
