import type { Component } from 'solid-js'

import '@unocss/reset/tailwind.css'
import '@unocss/reset/tailwind-compat.css'
import TestUseInterval from './test-useInterval'
import TestUseTimeoutFn from './test-useTimeoutFn'
import TestUseEventListener from './test-useEventListener'
import TestCreateGlobalState from './test-createGlobalState'

const App: Component = () => {
  return (
    <>
      <TestCreateGlobalState />
    </>

  )
}

export default App
