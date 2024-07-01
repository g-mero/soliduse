import watch from '@/watch'

export function TestWatch() {
  const [a, setA] = createSignal(0)
  const [b, setB] = createSignal(0)
  const [c, setC] = createSignal(0)

  watch([a, b], () => {
    console.log(a, b, c)
  })
  return (
    <div>
      <button onClick={() => setA(a() + 1)}>
        Increment A:
        {a()}
      </button>
      <button onClick={() => setB(b() + 1)}>
        Increment B:
        {b()}
      </button>
      <button onClick={() => setC(c() + 1)}>
        Increment C:
        {c()}
      </button>
    </div>
  )
}
