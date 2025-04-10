import path from 'node:path'
import { presetUno } from 'unocss'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig(({ command }) => {
  return {
    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
      },
    },
    plugins: [
      command === 'serve' &&
        UnoCSS({
          presets: [presetUno()],
        }),
      solidPlugin(),
    ],
  }
})
