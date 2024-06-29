import { onClickOutside } from '@/onClickOutside'

export default function TestOnClickOutside() {
  let ref!: HTMLDivElement
  let ref1!: HTMLDivElement
  let ref2!: HTMLDivElement
  const [count, setCount] = createSignal(0)
  const [count2, setCount2] = createSignal(0)
  const [count3, setCount3] = createSignal(0)

  onMount(() => {
    onClickOutside(ref, () => {
      setCount(count() + 1)
    })

    onClickOutside(ref1, () => {
      setCount2(count2() + 1)
    }, { detectIframe: true })

    onClickOutside(ref2, () => {
      setCount3(count3() + 1)
    }, { detectIframe: true })
  })

  return (
    <div ref={ref} class="p-4 bg-gray-200">
      <div>Click outside to increment count</div>
      <div>
        Count:
        {count()}
      </div>
      <div ref={ref1}>
        Count2:
        {count2()}
      </div>
      <div ref={ref2}>
        Count3:
        {count3()}
      </div>
    </div>
  )
}
