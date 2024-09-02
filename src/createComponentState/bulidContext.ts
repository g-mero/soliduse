/* eslint-disable no-prototype-builtins */

import { type EffectOptions, createComponent, getOwner, runWithOwner } from 'solid-js'
import type { SetStoreFunction } from 'solid-js/store'
import { getBrowserApi } from '@/utils/getBrowserApi'
import watch from '@/watch'

export interface Methods { setState?: undefined, [key: string]: ((...args: any[]) => any) | undefined }

// 定义一个泛型类型，用于对象的键和值
type Setter<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
}

export type RealState<T, M> = [Readonly<T>, Omit<M, 'setState'> & Omit<Setter<T>, keyof M> & { setState: SetStoreFunction<T> }]

export interface BuildContextOption {
  useStorage?: {
    type?: 'localStorage' | 'sessionStorage'
    key: string
  }
}

export interface RealContextThis<T, M> {
  state: RealState<T, M>[0]
  actions: RealState<T, M>[1]
}

// 辅助函数，用于首字母大写
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function buildRealState<T extends object, M extends Methods = {} >(state: () => T, methods?: M & ThisType<RealContextThis<T, M>>): RealState<T, M> {
  const [state2, setState] = createStore(state())

  const realState = [state2, {}] as RealState<T, M>

  for (const key in state2) {
    if (state2.hasOwnProperty(key)) {
      const setterName = `set${capitalize(key)}` as keyof Setter<T>
      // @ts-expect-error xxx
      realState[1][setterName] = (value: T[keyof T]) => {
        // @ts-expect-error xxx
        setState(key, value)
      }
    }
  }

  if (methods) {
    for (const key in methods) {
      if (methods.hasOwnProperty(key)) {
        // @ts-expect-error xxx
        realState[1][key] = (...args: any[]) => {
          // @ts-expect-error xxx
          return methods[key].apply({
            state: realState[0],
            actions: realState[1],
          }, args)
        }
      }
    }
  }

  realState[1].setState = setState

  return realState
}

export function buildContext<T extends object, M extends Methods = {}>(
  state: () => T,
  methods?: M & ThisType<RealContextThis<T, M>>,
  options?: BuildContextOption,
) {
  const context = createContext([{}, {}] as RealState<T, M>)

  const useThisContext = () => {
    return useContext(context)
  }

  return {
    useContext: useThisContext,
    initial() {
      if (options?.useStorage) {
        const storage = getBrowserApi(options?.useStorage.type || 'localStorage')
        if (storage) {
          const value = storage.getItem(options?.useStorage.key)
          if (value) {
            try {
              const parsedValue = JSON.parse(value)
              if (parsedValue) {
                const initialState = state()
                state = () => Object.assign(initialState, parsedValue)
              }
            }
            catch (error) {
              storage.setItem(options?.useStorage.key, JSON.stringify(state()))
            }
          }
          else {
            storage.setItem(options?.useStorage.key, JSON.stringify(state()))
          }
        }
      }

      const value = buildRealState(state, methods)
      if (options?.useStorage) {
        const [s] = value

        const buildKeys = () => {
          const keys: (keyof typeof s)[] = Object.keys(s) as any
          return keys.map((key) => { return () => s[key] })
        }

        watch([...buildKeys()], () => {
          const storage = getBrowserApi(options.useStorage?.type || 'localStorage')
          if (storage) {
            const key = options.useStorage?.key
            if (key) {
              storage.setItem(key, JSON.stringify(s))
            }
          }
        })
      }
      return { Provider(props: any) {
        return createComponent(context.Provider, { value, get children() { return props.children } })
      }, value }
    },
  }
}
