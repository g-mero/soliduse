/* eslint-disable ts/no-empty-object-type */
import type { Fn } from '@/utils/types'
import { buildRealState, type Getters, type Methods, type RealContextThis } from '@/createComponentState/bulidContext'
import useEventListener from '@/useEventListener'
import { getBrowserApi } from '@/utils/getBrowserApi'
import watch from '@/watch'
import { createRoot } from 'solid-js'

const shouldRun: Fn[] = []

function defineGlobalStore<T extends object, M extends Methods = {}, G extends Getters = {}>(
  name: string,
  params: {
    state: () => T
    getters?: G & ThisType<RealContextThis<T, G, M>>
    methods?: M & ThisType<RealContextThis<T, G, M>>
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
          return keys.map((key) => { return () => s[key] })
        }

        shouldRun.push(() => {
          const key = name
          if (!key)
            return

          const stored = storage.getItem(key)
          if (stored) {
            try {
              const storedState = JSON.parse(stored)

              for (const key in storedState) {
                if (Object.prototype.hasOwnProperty.call(s, key)) {
                  actions.setState(key as any, storedState[key])
                }
              }
            }
            catch {
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

                shouldSetKeys.forEach((key) => {
                  actions.setState(key as any, storedState[key])
                })
              }
              catch {
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
    shouldRun.forEach(fn => fn())
  })
}

export { defineGlobalStore, enableGlobalStore }
