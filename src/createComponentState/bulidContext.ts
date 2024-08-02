/* eslint-disable no-prototype-builtins */

import { type EffectOptions, createComponent, getOwner, runWithOwner } from 'solid-js'
import type { SetStoreFunction } from 'solid-js/store'

interface Methods { setState?: undefined, [key: string]: ((...args: any[]) => any) | undefined }

// 定义一个泛型类型，用于对象的键和值
type Setter<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
}

export type RealState<T, M> = [Readonly<T>, Setter<T> & Omit<Omit<M, keyof Setter<T>>, 'setState'> & { setState: SetStoreFunction<T> }]

export interface RealContextThis<T, M> {
  state: RealState<T, M>[0]
  actions: RealState<T, M>[1]
}

// 辅助函数，用于首字母大写
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function buildRealState<T extends object, M extends Methods >(state: () => T, methods?: M & ThisType<RealContextThis<T, M>>): RealState<T, M> {
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

// eslint-disable-next-line ts/no-empty-object-type
export function buildContext<T extends object, M extends Methods = {}>(
  state: () => T,
  methods?: M & ThisType<RealContextThis<T, M>>,
  options?: EffectOptions,
) {
  const context = createContext([{}, {}] as RealState<T, M>, options)

  const useThisContext = () => {
    return useContext(context)
  }

  return {
    useContext: useThisContext,
    initial() {
      const value = buildRealState(state, methods)
      return { Provider(props: any) {
        return createComponent(context.Provider, { value, get children() { return props.children } })
      }, value }
    },
  }
}
