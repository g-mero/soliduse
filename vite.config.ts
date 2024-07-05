import path from 'node:path'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import UnoCSS from 'unocss/vite'
import { presetUno } from 'unocss'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig(({ command }) => {
  return {
    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
      },
    },
    plugins: [
      command === 'serve' && UnoCSS({
        presets: [presetUno()],
      }),
      solidPlugin(),
      AutoImport({
        imports: ['solid-js'],
        dts: './auto-imports.d.ts',
        // resolvers: [
        //   IconsResolver({
        //     componentPrefix: 'Icon',
        //   }),
        // ],
      }),

    ],
  }
})
