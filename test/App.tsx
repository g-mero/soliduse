import type { Component } from 'solid-js'

import '@unocss/reset/tailwind.css'
import '@unocss/reset/tailwind-compat.css'
import TestUseInterval from './test-useInterval'
import TestUseTimeoutFn from './test-useTimeoutFn'
import TestUseEventListener from './test-useEventListener'
import TestCreateComponentState from './test-createComponentState'
import TestOnClickOutside from './test-onClickOutside'
import { TestWatch } from './test-watch'
import TestDefineGlobalStore from './test-defineGlobalStore'
import TestResizeObserver from './test-useResizeObserver'

const App: Component = () => {
  return (
    <>
      <TestResizeObserver />
    </>
  )
}

export default App
