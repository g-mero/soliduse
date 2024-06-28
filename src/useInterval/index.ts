import type { Accessor } from 'solid-js'
import type { Pausable } from '@/utils/types'
import useIntervalFn from '@/useIntervalFn'

/**
 * Reactive counter increases on every interval
 *
 * @param interval
 */
export default function useInterval(
  interval?: number,
): { counter: Accessor<number> } & Pausable {
  let count = 0
  const [counter, setCounter] = createSignal(count)
  const fn = () => {
    count++
    setCounter(count)
  }
  const control = useIntervalFn(fn, interval)
  return { counter, ...control }
}
