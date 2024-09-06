export interface UseResizeObserverOptions {
  /**
   * Sets which box model the observer will observe changes to. Possible values
   * are `content-box` (the default), `border-box` and `device-pixel-content-box`.
   *
   * @default 'content-box'
   */
  box?: ResizeObserverBoxOptions
}

/**
 * Reports changes to the dimensions of an Element's content or the border-box
 *
 * @see https://solidjs-use.github.io/solidjs-use/core/useResizeObserver
 */
export function useResizeObserver(
  target: Element | Element[],
  callback: ResizeObserverCallback,
  options: UseResizeObserverOptions = {},
) {
  if (isServer)
    return
  const { ...observerOptions } = options
  let observer: ResizeObserver | undefined

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = undefined
    }
  }

  const els = Array.isArray(target) ? target : [target]

  observer = new ResizeObserver(callback)
  for (const el of els) {
    observer.observe(el, observerOptions)
  }

  const stop = () => {
    cleanup()
  }

  onCleanup(stop)

  return {
    stop,
  }
}

export type UseResizeObserverReturn = ReturnType<typeof useResizeObserver>
