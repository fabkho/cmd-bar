import { inject, type InjectionKey } from 'vue'

export function requireInjection<T>(key: InjectionKey<T>, defaultValue?: T) {
  const resolved = inject(key, defaultValue)
  if (!resolved) {
    throw new Error(`${key} was not provided.`)
  }
  return resolved
}

export function findNodeById<T extends { id: string | null }>(
  nodes: T[],
  id: string | null
): T | undefined {
  return nodes.find((node) => node.id === id)
}

/**
 * @param node
 * @returns the inner dimensions (without padding and border) of the node as an DOMRect
 */
export const innerDimensions = (node: HTMLElement): DOMRect => {
  const style = getComputedStyle(node)

  const clientRect = node.getBoundingClientRect()

  const left = clientRect.left + parseInt(style.paddingLeft)
  const top = clientRect.top + parseInt(style.paddingTop)
  const width = clientRect.width - parseInt(style.paddingLeft) - parseInt(style.paddingRight)
  const height = clientRect.height - parseInt(style.paddingTop) - parseInt(style.paddingBottom)
  return new DOMRect(left, top, width, height)
}
