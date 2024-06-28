import type { Accessor } from 'solid-js'

export type Fn = () => void
export type AnyFn = (...args: any[]) => any
export type Arrayable<T> = T[] | T

export interface Pausable {
  pause: Fn
  resume: Fn
  isActive: Accessor<boolean>
}

export interface Stoppable {
  /**
   * A ref indicate whether a stoppable instance is executing
   */
  isPending: Accessor<boolean>

  /**
   * Stop the effect from executing
   */
  stop: Fn

  /**
   * Start the effects
   */
  start: Fn
}
