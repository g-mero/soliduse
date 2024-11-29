import watch from '@/watch'
import { createComponent, createContext, createMemo, useContext } from 'solid-js'
/* eslint-disable ts/no-empty-object-type */
import { createStore, type SetStoreFunction } from 'solid-js/store'

export interface Methods { setState?: undefined, [key: string]: ((...args: any[]) => any) | undefined }

type GetterObj<T extends Getters> = { [K in keyof T]: ReturnType<T[K]> }

export type RealState<T, G extends Getters, M> = [Readonly<T & GetterObj<G>>, Omit<Setter<T>, keyof M> & Omit<M, 'setState' | keyof G> & { setState: SetStoreFunction<T> }]

export interface Getters { [key: string]: ((...args: any[]) => any) }

export interface RealContextThis<T, G extends Getters, M> {
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

/**
 * 动态添加 getter 方法到对象
 * @param {object} obj - 目标对象
 * @param {string} propName - getter 的名称
 * @param {Function} getterFunction - getter 的实现逻辑
 */
function addGetter(obj: object, propName: string, getterFunction: () => any) {
  Object.defineProperty(obj, propName, {
    get: getterFunction,
    enumerable: false, // 属性是否可枚举
    configurable: true, // 属性是否可配置
  })
}

export function buildRealState<T extends object, M extends Methods = {}, G extends Getters = {} >(params: {
  state: () => T
  getters?: G & ThisType<RealContextThis<T, G, M>>
  methods?: M & ThisType<RealContextThis<T, G, M>>
}): RealState<T, G, M> {
  const { state, methods, getters } = params

  const newState = state()
  const actions = {} as any

  const realGetters = {} as any
  if (getters) {
    for (const key in getters) {
      addGetter(newState, key, () => {
        return realGetters[key]()
      })
    }
  }

  const [state2, setState] = createStore(newState)

  const realState = [state2, actions] as RealState<T, G, M>

  if (getters) {
    for (const key in getters) {
      realGetters[key] = createMemo((...args: any[]) => {
        return getters[key].apply({
          state: state2,
          actions,
        }, args)
      })
    }
  }

  for (const key in state2) {
    const setterName = `set${capitalize(key)}`
    actions[setterName] = (value: T[keyof T]) => {
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
          state: state2,
          actions,
        }, args)
      }
    }
  }

  actions.setState = setState

  return realState
}

export type MaybeSignals<T extends object> = { [K in keyof T]: T[K] | (() => T[K] | undefined) }

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
    initial(initialState?: Partial<MaybeSignals<T>>) {
      const resolvedInitialState = {} as any
      if (initialState) {
        for (const key in initialState) {
          const value = initialState[key]
          resolvedInitialState[key] = typeof value === 'function' ? value() : value
        }
      }

      const value = buildRealState({
        state: () => ({ ...params.state(), ...resolvedInitialState }) as T,
        getters: params.getters,
        methods: params.methods,
      })

      // watch
      if (initialState) {
        for (const key in initialState) {
          const state = initialState[key]
          if (typeof state === 'function') {
            watch(state as any, (newValue) => {
              if (newValue === undefined) {
                value[1].setState(key as any, params.state()[key])
                return
              }
              value[1].setState(key as any, newValue)
            })
          }
        }
      }

      return { Provider(props: any) {
        return createComponent(context.Provider, { value, get children() { return props.children } })
      }, value }
    },
  }
}
