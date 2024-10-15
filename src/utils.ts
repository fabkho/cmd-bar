export function findNodeByKey<T extends { key: string | null }>(
  nodes: T[],
  key: string | null
): T | undefined {
  return nodes.find((node) => node.key === key)
}
