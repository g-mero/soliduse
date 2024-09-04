import { createComponent } from 'solid-js'
import type { SetStoreFunction } from 'solid-js/store'

export interface Methods { setState?: undefined, [key: string]: ((...args: any[]) => any) | undefined }

export type RealState<T, G, M> = [Readonly<T>, Setter<T> & G & Omit<M, 'setState' | keyof G> & { setState: SetStoreFunction<T> }]

export interface Getters { [key: string]: ((...args: any[]) => any) }
export interface RealContextThis<T, G, M> {
  state: RealState<T, G, M>[0]
  actions: RealState<T, G, M>[1]
}

type Setter<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
}

// 辅助函数，用于首字母大写
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function buildRealState<T extends object, M extends Methods = {}, G extends Getters = {} >(params: {
  state: () => T
  getters?: G & ThisType<RealContextThis<T, G, M>>
  methods?: M & ThisType<RealContextThis<T, G, M>>
}): RealState<T, G, M> {
  const { state, methods, getters } = params

  const [state2, setState] = createStore(state())

  const realState = [state2, {}] as RealState<T, G, M>

  for (const key in state2) {
    const setterName = `set${capitalize(key)}`
    // @ts-expect-error xxx
    realState[1][setterName] = (value: T[keyof T]) => {
      // @ts-expect-error xxx
      setState(key, value)
    }
  }

  if (methods) {
    for (const key in methods) {
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

  if (getters) {
    for (const key in getters) {
      // @ts-expect-error xxx
      realState[1][key] = createMemo((...args: any[]) => {
        return getters[key].apply({
          state: realState[0],
          actions: realState[1],
        }, args)
      })
    }
  }

  realState[1].setState = setState

  return realState
}

export function buildContext<T extends object, M extends Methods = {}, G extends Getters = {} >(params: {
  state: () => T
  getters?: G & ThisType<RealContextThis<T, G, M>>
  methods?: M & ThisType<RealContextThis<T, G, M>>
}) {
  const context = createContext([{}, {}] as RealState<T, G, M>)

  const useThisContext = () => {
    return useContext(context)
  }

  return {
    useContext: useThisContext,
    initial() {
      const value = buildRealState(params)

      return { Provider(props: any) {
        return createComponent(context.Provider, { value, get children() { return props.children } })
      }, value }
    },
  }
}
