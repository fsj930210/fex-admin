export interface DepartmentNode {
  id: string
  name: string
  childCount: number
  disabled?: boolean
  children?: DepartmentNode[]
}

export interface TreePathNode {
  key: string
  label: string
}

export interface TreeSearchResult {
  node: DepartmentNode
  path: TreePathNode[]
}

export interface TreeSubtreeResponse {
  treeData: DepartmentNode[]
  expandedKeys: string[]
  targetKey: string
}

export interface TreeSubtreesResponse {
  treeData: DepartmentNode[]
  expandedKeys: string[]
  targetKeys: string[]
}
