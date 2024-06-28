/* eslint-disable no-prototype-builtins */
/* eslint-disable ts/ban-types */
import type { EffectOptions } from 'solid-js'
import type { SetStoreFunction } from 'solid-js/store'

type Methods<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]?: undefined;
} & { setState?: undefined, [key: string]: ((...args: any[]) => void) | undefined }

// 定义一个泛型类型，用于对象的键和值
type Setter<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
}

type RealState<T, M> = [Readonly<T>, Setter<T> & Omit<Omit<M, keyof Setter<T>>, 'setState'> & { setState: SetStoreFunction<T> }]

// 辅助函数，用于首字母大写
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// core 创建对象和方法
export function buildRealState<T extends object, M extends Methods<T> = {}>(state: () => T, Methods?: M): RealState<T, M> {
  const [state2, setState] = createStore(state())

  const realState = [state2, {}] as RealState<T, M>

  if (Methods) {
    for (const key in Methods) {
      if (Methods.hasOwnProperty(key)) {
        // @ts-expect-error xxx
        realState[1][key] = Methods[key]
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
  methods?: M,
  options?: EffectOptions,
) {
  const context = createContext([{}, {}] as RealState<T, M>, options)

  const useThisContext = () => {
    return useContext(context)
  }

  return {
    useContext: useThisContext,
    Provider: context.Provider,
    getValue: () => {
      return buildRealState(state, methods)
    },
    Root: context,
  }
}
