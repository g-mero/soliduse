import type { Accessor, OnEffectFunction } from 'solid-js'

export default function watch<T, U>(targets: [...Extract<{ [K in keyof T]: Accessor<T[K]>; }, readonly unknown[]>] | Accessor<T>, fn: OnEffectFunction<T, NoInfer<U> | undefined, U>) {
  createEffect(on(targets, fn))
}
