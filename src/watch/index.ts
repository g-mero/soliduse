import type { Accessor } from 'solid-js'
import type { Fn } from '@/utils/types'

export default function watch(targets: Accessor<any>[] | Accessor<any>, cb: Fn) {
  // @ts-expect-error xxx
  createEffect(on(targets, cb))
}
