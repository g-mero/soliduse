import useEventListener from '@/useEventListener'
import { isIOS, noop } from '@/utils/is'
import type { Fn } from '@/utils/types'

export interface OnClickOutsideOptions {
  /**
   * List of elements that should not trigger the event.
   */
  ignore?: Array<Element | string>
  /**
   * Use capturing phase for internal event listener.
   * @default true
   */
  capture?: boolean
  /**
   * Run handler function if focus moves to an iframe.
   * @default false
   */
  detectIframe?: boolean
}

export type OnClickOutsideHandler<
  T extends { detectIframe: OnClickOutsideOptions['detectIframe'] } = { detectIframe: false },
> = (evt: T['detectIframe'] extends true ? PointerEvent | FocusEvent : PointerEvent) => void

let _iOSWorkaround = false


export function onClickOutside<T extends OnClickOutsideOptions>(
  target: Array<Element> | Element,
  handler: OnClickOutsideHandler<{ detectIframe: T['detectIframe'] }>,
  options: T = {} as T,
) {
  const { capture = true, detectIframe = false } = options

  if (!window)
    return

  // Fixes: https://github.com/vueuse/vueuse/issues/1520
  // How it works: https://stackoverflow.com/a/39712411
  if (isIOS && !_iOSWorkaround) {
    _iOSWorkaround = true
    Array.from(window.document.body.children).forEach(el => el.addEventListener('click', noop))
    window.document.documentElement.addEventListener('click', noop)
  }

  let shouldListen = true

  const listener = (event: PointerEvent) => {
    const el = Array.isArray(target) ? target.find(el => el.contains(event.target as Node)) : target

    if (!el || el === event.target || event.composedPath().includes(el))
      return

    if (!shouldListen) {
      shouldListen = true
      return
    }

    handler(event)
  }

  const cleanup = [
    useEventListener(window, 'click', listener, { passive: true, capture }),
    useEventListener(
      window,
      'pointerdown',
      (e) => {
        const el = Array.isArray(target) ? target.find(el => el.contains(e.target as Node)) : target
        if (el)
          shouldListen = !e.composedPath().includes(el)
      },
      { passive: true },
    ),
    detectIframe
    && useEventListener(window, 'blur', (event) => {
      setTimeout(() => {
        const el = Array.isArray(target) ? target.find(el => el.contains(event.target as Node)) : target
        if (
          window.document.activeElement?.tagName === 'IFRAME'
          && !el?.contains(window.document.activeElement)
        ) {
          handler(event as any)
        }
      }, 0)
    }),
  ].filter(Boolean) as Fn[]

  const stop = () => cleanup.forEach(fn => fn())

  return stop
}
