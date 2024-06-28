/* eslint-disable ts/ban-types */
import { buildRealState } from '../createComponentState/bulidContext'

type Methods<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]?: undefined;
} & { setState?: undefined, [key: string]: ((...args: any[]) => void) | undefined }

export function createGlobalState<T extends object, M extends Methods<T> = {}>(
  state: () => T,
  methods?: M,
) {
  return buildRealState(state, methods)
}
