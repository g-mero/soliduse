import type { Component } from 'solid-js'

import '@unocss/reset/tailwind.css'
import '@unocss/reset/tailwind-compat.css'
import TestMountStyle from './test-mountStyle'

const App: Component = () => {
  return (
    <>
      <TestMountStyle />
    </>
  )
}

export default App
