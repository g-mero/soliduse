import watch from '@/watch'
import { createSignal } from 'solid-js'

export function TestWatch() {
  const [a, setA] = createSignal(0)
  const [b, setB] = createSignal('0')
  const [c, setC] = createSignal(0)

  watch(a, (_input, prevInput) => {
    console.log(prevInput)
  })
  return (
    <div>
      <button type='button' onClick={() => setA(a() + 1)}>
        Increment A:
        {a()}
      </button>
      <button type='button' onClick={() => setB(b() + 1)}>
        Increment B:
        {b()}
      </button>
      <button type='button' onClick={() => setC(c() + 1)}>
        Increment C:
        {c()}
      </button>
    </div>
  )
}
