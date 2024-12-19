import type { Accessor, AccessorArray, OnEffectFunction } from 'solid-js'
import { createEffect, on } from 'solid-js'

export default function watch<S, Next extends Prev, Prev = Next>(
  targets: AccessorArray<S> | Accessor<S>,
  fn: OnEffectFunction<S, undefined | NoInfer<Prev>, Next>,
  opt?: {
    defer?: boolean
  },
) {
  createEffect(on(targets, fn, { defer: opt?.defer }) as any)
}
