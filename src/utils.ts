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
