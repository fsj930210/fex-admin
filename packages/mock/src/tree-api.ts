export interface DemoDepartmentNode {
  id: string
  name: string
  childCount: number
  disabled?: boolean
  children?: DemoDepartmentNode[]
}

export interface DemoTreeSearchResult {
  node: DemoDepartmentNode
  path: readonly { key: string; label: string }[]
}

export interface DemoTreeSubtree {
  treeData: DemoDepartmentNode[]
  expandedKeys: string[]
  targetKey: string
}

export interface DemoTreeSubtrees {
  treeData: DemoDepartmentNode[]
  expandedKeys: string[]
  targetKeys: string[]
}

interface ResponseEnvelope<T> { code: number; message: string; data: T }

async function get<T>(path: string, signal?: AbortSignal) {
  const response = await fetch(`/tree-api${path}`, signal ? { signal } : undefined)
  const envelope = await response.json() as ResponseEnvelope<T>
  if (!response.ok || (envelope.code !== 0 && envelope.code !== 200)) throw new Error(envelope.message || `Request failed (${response.status})`)
  return envelope.data
}

export const demoTreeFieldNames = { key: 'id', title: 'name', children: 'children' } as const
export const isDemoDepartmentLeaf = (node: DemoDepartmentNode) => node.childCount === 0
export const getDemoTreeExpandedKeys = (nodes: readonly DemoDepartmentNode[]): string[] => nodes.flatMap((node) => node.children?.length ? [node.id, ...getDemoTreeExpandedKeys(node.children)] : [])
export const getDemoTreeRoots = (signal?: AbortSignal) => get<DemoDepartmentNode[]>('/tree/roots', signal)
export const getDemoTreeChildren = (key: string | number, signal?: AbortSignal) => get<DemoDepartmentNode[]>(`/tree/nodes/${encodeURIComponent(key)}/children`, signal)
export const searchDemoTree = (keyword: string, signal?: AbortSignal) => get<DemoTreeSearchResult[]>(`/tree/search?keyword=${encodeURIComponent(keyword)}`, signal)
export const searchDemoTreeAsTree = (keyword: string, signal?: AbortSignal) => get<DemoDepartmentNode[]>(`/tree/search-tree?keyword=${encodeURIComponent(keyword)}`, signal)
export const getDemoTreeSubtree = (key: string | number, signal?: AbortSignal) => get<DemoTreeSubtree>(`/tree/nodes/${encodeURIComponent(key)}/subtree`, signal)
export const getDemoTreeSubtrees = (keys: readonly (string | number)[], signal?: AbortSignal) => get<DemoTreeSubtrees>(`/tree/subtrees?keys=${encodeURIComponent(keys.join(','))}`, signal)
