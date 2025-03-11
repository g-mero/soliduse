import { createSignal, onCleanup } from 'solid-js'

export default function useIntervalFn(fn: () => void, delay = 500) {
  let id = setInterval(fn, delay)
  const [isActive, setIsActive] = createSignal(true)
  const pause = () => {
    clearInterval(id)
    setIsActive(false)
  }
  const resume = () => {
    pause()
    id = setInterval(fn, delay)
    setIsActive(true)
  }
  onCleanup(() => pause())
  return {
    pause,
    resume,
    isActive,
  }
}
