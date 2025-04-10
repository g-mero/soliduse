// uno.config.ts
import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  shortcuts: [
    // ...
  ],
  theme: {
    colors: {
      // ...
    },
  },
  variants: [
    // 通用变体处理器
    (matcher) => {
      const regex = /^gm-([\w-]+):/
      const match = matcher.match(regex)

      // 如果没有匹配到 gm-xxx: 前缀，返回原始 matcher
      if (!match) return matcher

      // 提取 gm- 后的部分
      const rest = match[1]

      // 返回修改后的 matcher 和 selector
      return {
        matcher: matcher.replace(regex, ''),
        selector: (s) => `${s}[data-gm-${rest}]`,
      }
    },
  ],
  presets: [presetUno()],
})
