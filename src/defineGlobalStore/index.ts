import { type Methods, type RealContextThis, buildRealState } from '@/createComponentState/bulidContext'
import useEventListener from '@/useEventListener'
import { getBrowserApi } from '@/utils/getBrowserApi'
import watch from '@/watch'

export interface BuildContextOption {
  useStorage?: {
    type?: 'localStorage' | 'sessionStorage'
    key: string
  }
}

function defineGlobalStore<T extends object, M extends Methods = {}>(
  name: string,
  params: {
    state: () => T
    methods?: M & ThisType<RealContextThis<T, M>>
    persist?: 'sessionStorage' | 'localStorage'
  },
) {
  const { state, methods, persist } = params
  const context = buildRealState(state, methods)

  if (persist) {
    const storage = getBrowserApi(persist || 'localStorage')
    if (storage) {
      const [s, actions] = context

      const buildKeys = () => {
        const keys: (keyof typeof s)[] = Object.keys(s) as any
        return keys.map((key) => { return () => s[key] })
      }

      createRoot(() => {
        onMount(() => {
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
            catch (e) {
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
                for (const key in storedState) {
                  actions.setState(key as any, storedState[key])
                }
              }
              catch (e) {
                storage.setItem(key, JSON.stringify(s))
              }
            }
          })
        })
      })
    }
  }

  return context
}

export default defineGlobalStore
