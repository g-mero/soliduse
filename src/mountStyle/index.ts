import { isClient } from '@/utils/is'

const alreadyInjected: string[] = []
export function mountStyle(style: string, id: string, refresh = false) {
  if (!isClient) return
  if (alreadyInjected.includes(id) && !refresh) return

  let styleElement = document.querySelector(`style#${id}`)

  if (styleElement) {
    styleElement.innerHTML = style
    return
  }

  styleElement = document.createElement('style')
  styleElement.id = id
  styleElement.innerHTML = style
  document.head.appendChild(styleElement)
  alreadyInjected.push(id)
}
