import { useResizeObserver } from '@/useResizeObserver'

export default function TestResizeObserver() {
  let ref!: HTMLDivElement

  onMount(() => {
    useResizeObserver(ref, ([entry]) => {
      console.log(entry)
    }, { box: 'border-box' })
  })
  return (
    <div>
      <div ref={ref} class="m-2 p-2 bg-gray-2">
        <textarea value="xxxxx" />
      </div>
    </div>
  )
}
