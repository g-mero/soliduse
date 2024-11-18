import { isServer } from 'solid-js/web'

export function getBrowserApi<T extends keyof Window>(windowApi: T): Window[T] | null {
  if (!isServer) {
    return window[windowApi]
  }
  return null
}
