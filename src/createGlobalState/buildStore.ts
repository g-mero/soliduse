/* eslint-disable ts/ban-types */
import type { Methods } from '../createComponentState/bulidContext'
import { buildRealState } from '../createComponentState/bulidContext'

export function createGlobalState<T extends object, M extends Methods = {}>(
  state: () => T,
  methods?: M,
) {
  return buildRealState(state, methods)
}
