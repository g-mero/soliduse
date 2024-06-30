/* eslint-disable no-prototype-builtins */
/* eslint-disable ts/ban-types */
import { type EffectOptions, createComponent, getOwner, runWithOwner } from 'solid-js'
import type { SetStoreFunction } from 'solid-js/store'

type Methods<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]?: undefined;
} & { setState?: undefined, [key: string]: ((...args: any[]) => any) | undefined }

// 定义一个泛型类型，用于对象的键和值
type Setter<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
}

type RealState<T, M> = [Readonly<T>, Setter<T> & Omit<Omit<M, keyof Setter<T>>, 'setState'> & { setState: SetStoreFunction<T> }]

interface RealContextThis<T, M> {
  state: RealState<T, M>[0]
  actions: RealState<T, M>[1]
}

// 辅助函数，用于首字母大写
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function buildRealState<T extends object, M extends Methods<T> >(state: () => T, methods?: M & ThisType<RealContextThis<T, M>>): RealState<T, M> {
  const [state2, setState] = createStore(state())

  const realState = [state2, {}] as RealState<T, M>

  if (methods) {
    for (const key in methods) {
      if (methods.hasOwnProperty(key)) {
        // @ts-expect-error xxx
        realState[1][key] = (...args: any[]) => {
          // @ts-expect-error xxx
          methods[key].apply({
            state: realState[0],
            actions: realState[1],
          }, args)
        }
      }
    }
  }

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

  realState[1].setState = setState

  return realState
}

export function buildContext<T extends object, M extends Methods<T> = {}>(
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
