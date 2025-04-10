/* eslint-disable ts/no-empty-object-type */
import type { Getters, Methods, RealContextThis } from '@/createComponentState/buildContext'
import { buildRealState } from '@/createComponentState/buildContext'
import useEventListener from '@/useEventListener'
import { getBrowserApi } from '@/utils/getBrowserApi'
import type { Fn } from '@/utils/types'
import watch from '@/watch'
import { createRoot } from 'solid-js'

const shouldRun: Fn[] = []

function defineGlobalStore<
  T extends object,
  U extends object = {},
  M extends Methods = {},
  G extends Getters = {},
>(
  name: string,
  params: {
    state: () => T
    nowrapData?: U
    getters?: G & ThisType<Omit<RealContextThis<T, U, G, M>, 'actions'>>
    methods?: M & ThisType<RealContextThis<T, U, G, M>>
    persist?: 'sessionStorage' | 'localStorage'
  },
) {
  // use createRoot to prevent console warning
  // actually, it never dispose as same as not use this method
  return createRoot(() => {
    const context = buildRealState(params)

    if (params.persist) {
      const storage = getBrowserApi(params.persist || 'localStorage')
      if (storage) {
        const [s, actions] = context

        const buildKeys = () => {
          const keys: (keyof typeof s)[] = Object.keys(s) as any
          return keys.map((key) => {
            return () => s[key]
          })
        }

        shouldRun.push(() => {
          const key = name
          if (!key) return

          const stored = storage.getItem(key)
          if (stored) {
            try {
              const storedState = JSON.parse(stored)

              for (const key in storedState) {
                if (Object.prototype.hasOwnProperty.call(s, key)) {
                  actions.setState(key as any, storedState[key])
                }
              }
            } catch {
              storage.setItem(key, JSON.stringify(s))
            }
          }

          watch([...buildKeys()], () => {
            storage.setItem(key, JSON.stringify(s))
          })

          useEventListener('storage', (e) => {
            if (e.key === key) {
              try {
                const storedState = JSON.parse(e.newValue || '')
                const shouldSetKeys = []
                for (const key in storedState) {
                  if (s[key] !== storedState[key]) {
                    shouldSetKeys.push(key)
                  }
                }

                // biome-ignore lint/complexity/noForEach: <explanation>
                shouldSetKeys.forEach((key) => {
                  actions.setState(key as any, storedState[key])
                })
              } catch {
                storage.setItem(key, JSON.stringify(s))
              }
            }
          })
        })
      }
    }

    return context
  })
}

function enableGlobalStore() {
  createRoot(() => {
    // biome-ignore lint/complexity/noForEach: <explanation>
    shouldRun.forEach((fn) => fn())
  })
}

export { defineGlobalStore, enableGlobalStore }
