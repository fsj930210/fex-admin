import type {
  TreeItem,
  TreeInsertInput,
  TreeKey,
  TreeMoveInput,
  TreeMutationResult,
  TreeNodeData,
  TreeOptions,
  TreeResolvedFieldNames,
  TreeSnapshot,
  TreeVisibleItem,
} from './types'

export type TreeFeatureId = string

export interface TreeFeatureContext<TNode extends TreeNodeData> {
  getSnapshot(): TreeSnapshot<TNode>
  getItem(key: TreeKey): TreeItem<TNode> | undefined
  getPath(key: TreeKey): TreeKey[]
  updateFeatureState(changedKeys?: readonly TreeKey[]): void
  configure(options: Partial<TreeOptions<TNode>>): void
  getOptions(): TreeOptions<TNode>
  getItems(): ReadonlyMap<TreeKey, TreeItem<TNode>>
  getVisibleItems(): readonly TreeVisibleItem<TNode>[]
  getChildrenKeys(key: TreeKey | null): readonly TreeKey[]
  getAncestorKeys(key: TreeKey): readonly TreeKey[]
  getDescendantKeys(key: TreeKey): readonly TreeKey[]
  setStateKeys(
    field: 'expandedKeys' | 'selectedKeys' | 'checkedKeys',
    keys: readonly TreeKey[],
    changedKeys: readonly TreeKey[],
  ): void
  initializeStateKeys(
    field: 'expandedKeys' | 'selectedKeys' | 'checkedKeys',
    keys: readonly TreeKey[],
  ): void
  setFocusedKey(key: TreeKey | null): void
  getFeature<TApi>(id: TreeFeatureId): TApi | undefined
  getFieldNames(): TreeResolvedFieldNames
  getKey(node: TNode): TreeKey
  getChildren(node: TNode): readonly TNode[]
  updateNode(
    key: TreeKey,
    patch: Partial<TNode> | ((node: TNode) => TNode),
  ): TreeMutationResult
  insertNode(input: TreeInsertInput<TNode>): TreeMutationResult
  removeNode(key: TreeKey): TreeMutationResult
  moveNode(input: TreeMoveInput): TreeMutationResult
  replaceChildren(parentKey: TreeKey | null, children: readonly TNode[]): TreeMutationResult
}

export interface TreeFeature<TNode extends TreeNodeData, TOptions = unknown, TApi = unknown> {
  id: TreeFeatureId
  requires?: readonly TreeFeatureId[] | undefined
  conflicts?: readonly TreeFeatureId[] | undefined
  setup(context: TreeFeatureContext<TNode>, options: TOptions): TApi
}

export interface TreeFeatureRegistration<TNode extends TreeNodeData> {
  feature: TreeFeature<TNode, unknown, unknown>
  options: unknown
}

export interface InstalledTreeFeature<TApi = unknown> {
  id: TreeFeatureId
  api: TApi
}
