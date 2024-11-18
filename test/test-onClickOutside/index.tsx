import { onClickOutside } from '@/onClickOutside'
import { createSignal, onCleanup, onMount, Show } from 'solid-js'

function CanClose(props: {
  setOpen: (open: boolean) => void
}) {
  let ref!: HTMLDivElement

  onMount(() => {
    // this is event
    //
    // eslint-disable-next-line solid/reactivity
    onClickOutside(ref, () => {
      props.setOpen(false)
      console.log(1)
    })
  })

  onCleanup(() => {
    console.log(2)
  })

  return (

    <div ref={ref}>

      <div class="p-4 bg-gray-200">
        Click outside to close
      </div>

    </div>

  )
}

export default function TestOnClickOutside() {
  let ref!: HTMLDivElement
  let ref1!: HTMLDivElement
  let ref2!: HTMLDivElement
  const [count, setCount] = createSignal(0)
  const [count2, _setCount2] = createSignal(0)
  const [count3, _setCount3] = createSignal(0)

  const [open, setOpen] = createSignal(true)

  onMount(() => {
    onClickOutside(ref, () => {
      setCount(count() + 1)
    }, {
      ignore: [ref1, ref2],
    })
  })

  return (
    <div class="p-4 bg-gray-200">
      <div>Click outside to increment count</div>
      <div ref={ref}>
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
      <Show when={open()}>
        <CanClose setOpen={setOpen} />
      </Show>
    </div>
  )
}
