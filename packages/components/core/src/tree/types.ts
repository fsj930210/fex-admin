import type { TreeFeatureRegistration } from './feature-types'

export type TreeKey = string | number

export type TreeNodeData = Record<string, unknown>

export interface TreeFieldNames {
  key?: string | undefined
  title?: string | undefined
  children?: string | undefined
  isLeaf?: string | undefined
  disabled?: string | undefined
}

export interface TreeResolvedFieldNames {
  key: string
  title: string
  children: string
  isLeaf: string
  disabled: string
}

export interface TreeItem<TNode extends TreeNodeData> {
  key: TreeKey
  node: TNode
  parentKey: TreeKey | null
  depth: number
  index: number
  isLeaf: boolean
  disabled: boolean
}

export interface TreeVisibleItem<TNode extends TreeNodeData> extends TreeItem<TNode> {
  visibleIndex: number
}

export type TreeCheckMode = 'cascade' | 'strict'
export type TreeCheckedState = boolean | 'indeterminate'
export type TreeLoadState = 'unloaded' | 'loading' | 'loaded' | 'error'

export interface TreeChangeMeta {
  changedKeys: readonly TreeKey[]
}

export interface TreeOptions<TNode extends TreeNodeData> {
  treeData: readonly TNode[]
  features?: readonly TreeFeatureRegistration<TNode>[] | undefined
  fieldNames?: TreeFieldNames | undefined
  isLeaf?: ((node: TNode) => boolean) | undefined
  checkMode?: TreeCheckMode | undefined
  asyncLoader?: TreeAsyncLoaderOptions<TNode> | undefined

  expandedKeys?: readonly TreeKey[] | undefined
  defaultExpandedKeys?: readonly TreeKey[] | undefined
  onExpandedKeysChange?: ((keys: readonly TreeKey[], meta: TreeChangeMeta) => void) | undefined

  selectedKeys?: readonly TreeKey[] | undefined
  defaultSelectedKeys?: readonly TreeKey[] | undefined
  multiple?: boolean | undefined
  onSelectedKeysChange?: ((keys: readonly TreeKey[], meta: TreeChangeMeta) => void) | undefined

  checkedKeys?: readonly TreeKey[] | undefined
  defaultCheckedKeys?: readonly TreeKey[] | undefined
  onCheckedKeysChange?: ((keys: readonly TreeKey[], meta: TreeChangeMeta) => void) | undefined

  focusedKey?: TreeKey | null | undefined
  defaultFocusedKey?: TreeKey | null | undefined
  onFocusedKeyChange?: ((key: TreeKey | null) => void) | undefined

  onTreeDataChange?: ((treeData: readonly TNode[], mutation: TreeMutationResult) => void) | undefined
}

export interface TreeAsyncLoaderOptions<TNode extends TreeNodeData> {
  loadChildren: (
    item: TreeItem<TNode>,
    context: { signal: AbortSignal },
  ) => Promise<readonly TNode[]>
  onLoadError?: (error: unknown, key: TreeKey) => void
}

export interface TreeSnapshot<TNode extends TreeNodeData> {
  treeData: readonly TNode[]
  expandedKeys: readonly TreeKey[]
  selectedKeys: readonly TreeKey[]
  checkedKeys: readonly TreeKey[]
  focusedKey: TreeKey | null
  items: ReadonlyMap<TreeKey, TreeItem<TNode>>
  visibleItems: readonly TreeVisibleItem<TNode>[]
}

export interface TreeInsertInput<TNode extends TreeNodeData> {
  parentKey: TreeKey | null
  node: TNode
  index?: number
}

export interface TreeMoveInput {
  sourceKey: TreeKey
  parentKey: TreeKey | null
  index: number
}

export interface TreeMutationResult {
  ok: boolean
  type: 'insert' | 'update' | 'remove' | 'move' | 'replace-children'
  changedKeys: readonly TreeKey[]
  removedKeys?: readonly TreeKey[]
  reason?: string
}

export interface TreeSearchSubtreeOptions<TNode extends TreeNodeData> {
  keyword: string
  filterTreeNode: (node: TNode, keyword: string) => boolean
}

export interface TreeController<TNode extends TreeNodeData> {
  getSnapshot(): TreeSnapshot<TNode>
  subscribe(listener: () => void): () => void
  subscribeNode(key: TreeKey, listener: () => void): () => void
  subscribeVisible(listener: () => void): () => void
  subscribeSelector<T>(
    selector: (snapshot: TreeSnapshot<TNode>) => T,
    listener: () => void,
    isEqual?: (left: T, right: T) => boolean,
  ): () => void
  hasFeature(id: string): boolean
  getFeature<TApi>(id: string): TApi | undefined
  updateOptions(options: Partial<TreeOptions<TNode>>): void

  updateNode(
    key: TreeKey,
    patch: Partial<TNode> | ((node: TNode) => TNode),
  ): TreeMutationResult
  insertNode(input: TreeInsertInput<TNode>): TreeMutationResult
  removeNode(key: TreeKey): TreeMutationResult
  moveNode(input: TreeMoveInput): TreeMutationResult
  replaceChildren(parentKey: TreeKey | null, children: readonly TNode[]): TreeMutationResult

  getItem(key: TreeKey): TreeItem<TNode> | undefined
  getPath(key: TreeKey): TreeKey[]
  getVisibleItems(): readonly TreeVisibleItem<TNode>[]
  getVisibleCount(): number
  getVisibleItemAt(index: number): TreeVisibleItem<TNode> | undefined
  getVisibleIndex(key: TreeKey): number | undefined
}
