import type { Accessor } from 'solid-js'
import type { Fn } from '@/utils/types'

export default function watch<T>(targets: Accessor<T>[], cb: Fn) {
  createEffect(on(targets, cb))
}
