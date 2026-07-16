import { createStore } from '../store/create-store'
import { createTreeFeatureRuntime } from './create-feature-runtime'
import type { TreeFeatureRuntime } from './create-feature-runtime'
import type {
  TreeController,
  TreeInsertInput,
  TreeItem,
  TreeKey,
  TreeMoveInput,
  TreeMutationResult,
  TreeNodeData,
  TreeOptions,
  TreeResolvedFieldNames,
  TreeSnapshot,
  TreeVisibleItem,
} from './types'

const defaultFieldNames: TreeResolvedFieldNames = {
  key: 'key',
  title: 'title',
  children: 'children',
  isLeaf: 'isLeaf',
  disabled: 'disabled',
}

type Index<TNode extends TreeNodeData> = {
  items: Map<TreeKey, TreeItem<TNode>>
  childrenByKey: Map<TreeKey | null, TreeKey[]>
  parentByKey: Map<TreeKey, TreeKey | null>
}

function uniqueKeys(keys: readonly TreeKey[]) {
  return [...new Set(keys)]
}

function sameKeys(left: readonly TreeKey[], right: readonly TreeKey[]) {
  return left.length === right.length && left.every((key, index) => key === right[index])
}

function failMutation(type: TreeMutationResult['type'], reason: string): TreeMutationResult {
  return { ok: false, type, changedKeys: [], reason }
}

/**
 * Owns the normalized tree index, snapshots, subscriptions, visible projection,
 * and framework-independent immutable tree-data mutations.
 * Optional behavior is installed by feature modules so unused algorithms remain tree-shakeable.
 */
export function createTreeController<TNode extends TreeNodeData>(
  initialOptions: TreeOptions<TNode>,
): TreeController<TNode> {
  let options = initialOptions
  let featureRuntime: TreeFeatureRuntime<TNode> | undefined
  let index: Index<TNode> = {
    items: new Map(),
    childrenByKey: new Map(),
    parentByKey: new Map(),
  }
  const nodeListeners = new Map<TreeKey, Set<() => void>>()
  const visibleListeners = new Set<() => void>()

  function getFieldNames(): TreeResolvedFieldNames {
    return {
      key: options.fieldNames?.key ?? defaultFieldNames.key,
      title: options.fieldNames?.title ?? defaultFieldNames.title,
      children: options.fieldNames?.children ?? defaultFieldNames.children,
      isLeaf: options.fieldNames?.isLeaf ?? defaultFieldNames.isLeaf,
      disabled: options.fieldNames?.disabled ?? defaultFieldNames.disabled,
    }
  }

  function getKey(node: TNode): TreeKey {
    const field = getFieldNames().key
    const key = node[field]
    if (typeof key !== 'string' && typeof key !== 'number') {
      throw new Error(`Tree node field "${field}" must be a string or number.`)
    }
    return key
  }

  function getChildren(node: TNode): readonly TNode[] {
    const value = node[getFieldNames().children]
    return Array.isArray(value) ? (value as readonly TNode[]) : []
  }

  function isLeaf(node: TNode) {
    if (options.isLeaf) return options.isLeaf(node)
    const value = node[getFieldNames().isLeaf]
    return typeof value === 'boolean' ? value : getChildren(node).length === 0
  }

  function isDisabled(node: TNode) {
    return node[getFieldNames().disabled] === true
  }

  function updateTreeNode(
    nodes: readonly TNode[],
    key: TreeKey,
    update: (node: TNode) => TNode,
  ): readonly TNode[] {
    // oxlint-disable-next-line unicorn/no-array-reverse -- getAncestorKeys returns a fresh array and the workspace targets ES2022.
    const path = [...getAncestorKeys(key).reverse(), key]
    const updateAtDepth = (currentNodes: readonly TNode[], depth: number): readonly TNode[] => {
      const item = index.items.get(path[depth] as TreeKey)
      if (!item) return currentNodes
      const currentNode = currentNodes[item.index]
      if (!currentNode || getKey(currentNode) !== item.key) return currentNodes

      let nextNode: TNode
      if (depth === path.length - 1) {
        nextNode = update(currentNode)
      } else {
        const children = getChildren(currentNode)
        const nextChildren = updateAtDepth(children, depth + 1)
        if (nextChildren === children) return currentNodes
        nextNode = { ...currentNode, [getFieldNames().children]: nextChildren }
      }
      if (nextNode === currentNode) return currentNodes
      const nextNodes = [...currentNodes]
      nextNodes[item.index] = nextNode
      return nextNodes
    }
    return updateAtDepth(nodes, 0)
  }

  function removeTreeNode(nodes: readonly TNode[], key: TreeKey): readonly TNode[] {
    let changed = false
    const nextNodes: TNode[] = []
    for (const node of nodes) {
      if (getKey(node) === key) {
        changed = true
        continue
      }
      const children = getChildren(node)
      const nextChildren = children.length > 0 ? removeTreeNode(children, key) : children
      if (nextChildren !== children) {
        changed = true
        nextNodes.push({ ...node, [getFieldNames().children]: nextChildren })
      } else {
        nextNodes.push(node)
      }
    }
    return changed ? nextNodes : nodes
  }

  function insertTreeNode(
    nodes: readonly TNode[],
    input: TreeInsertInput<TNode>,
  ): readonly TNode[] | undefined {
    if (input.parentKey === null) {
      const nextNodes = [...nodes]
      nextNodes.splice(Math.max(0, Math.min(input.index ?? nextNodes.length, nextNodes.length)), 0, input.node)
      return nextNodes
    }
    let inserted = false
    const nextNodes = nodes.map((node) => {
      if (getKey(node) === input.parentKey) {
        inserted = true
        const children = [...getChildren(node)]
        children.splice(Math.max(0, Math.min(input.index ?? children.length, children.length)), 0, input.node)
        return { ...node, [getFieldNames().children]: children }
      }
      const children = getChildren(node)
      if (children.length === 0) return node
      const nextChildren = insertTreeNode(children, input)
      if (!nextChildren) return node
      inserted = true
      return { ...node, [getFieldNames().children]: nextChildren }
    })
    return inserted ? nextNodes : undefined
  }

  function rebuildIndex(treeData: readonly TNode[]) {
    const items = new Map<TreeKey, TreeItem<TNode>>()
    const childrenByKey = new Map<TreeKey | null, TreeKey[]>()
    const parentByKey = new Map<TreeKey, TreeKey | null>()

    const visit = (nodes: readonly TNode[], parentKey: TreeKey | null, depth: number) => {
      const keys: TreeKey[] = []
      nodes.forEach((node, itemIndex) => {
        const key = getKey(node)
        if (items.has(key)) throw new Error(`Tree node key "${String(key)}" is duplicated.`)
        keys.push(key)
        parentByKey.set(key, parentKey)
        items.set(key, {
          key,
          node,
          parentKey,
          depth,
          index: itemIndex,
          isLeaf: isLeaf(node),
          disabled: isDisabled(node),
        })
        visit(getChildren(node), key, depth + 1)
      })
      childrenByKey.set(parentKey, keys)
    }

    visit(treeData, null, 0)
    index = { items, childrenByKey, parentByKey }
  }

  function buildVisibleItems(expandedKeys: readonly TreeKey[]) {
    const expanded = new Set(expandedKeys)
    const visible: TreeVisibleItem<TNode>[] = []
    const visit = (key: TreeKey) => {
      const item = index.items.get(key)
      if (!item) return
      visible.push({ ...item, visibleIndex: visible.length })
      if (expanded.has(key)) {
        for (const childKey of index.childrenByKey.get(key) ?? []) visit(childKey)
      }
    }
    for (const key of index.childrenByKey.get(null) ?? []) visit(key)
    return visible
  }

  function buildSnapshot(
    treeData: readonly TNode[],
    expandedKeys: readonly TreeKey[],
    selectedKeys: readonly TreeKey[],
    checkedKeys: readonly TreeKey[],
    focusedKey: TreeKey | null,
  ): TreeSnapshot<TNode> {
    rebuildIndex(treeData)
    const validKeys = new Set(index.items.keys())
    const nextExpandedKeys = uniqueKeys(expandedKeys.filter((key) => validKeys.has(key)))
    return {
      treeData,
      expandedKeys: nextExpandedKeys,
      selectedKeys: uniqueKeys(selectedKeys.filter((key) => validKeys.has(key))),
      checkedKeys: uniqueKeys(checkedKeys.filter((key) => validKeys.has(key))),
      focusedKey: focusedKey !== null && validKeys.has(focusedKey) ? focusedKey : null,
      items: index.items,
      visibleItems: buildVisibleItems(nextExpandedKeys),
    }
  }

  const initialSnapshot = buildSnapshot(
    initialOptions.treeData,
    initialOptions.defaultExpandedKeys ?? initialOptions.expandedKeys ?? [],
    initialOptions.defaultSelectedKeys ?? initialOptions.selectedKeys ?? [],
    initialOptions.defaultCheckedKeys ?? initialOptions.checkedKeys ?? [],
    initialOptions.defaultFocusedKey ?? initialOptions.focusedKey ?? null,
  )
  const store = createStore(initialSnapshot)

  function getSnapshot() {
    return store.getSnapshot()
  }

  function notifyNodes(keys: readonly TreeKey[], visibleChanged = false) {
    for (const key of keys) {
      for (const listener of nodeListeners.get(key) ?? []) listener()
    }
    if (visibleChanged) {
      for (const listener of visibleListeners) listener()
    }
  }

  function setSnapshot(
    next: TreeSnapshot<TNode>,
    changedKeys: readonly TreeKey[],
    visibleChanged: boolean,
  ) {
    store.setSnapshot(next)
    notifyNodes(changedKeys, visibleChanged)
  }

  function commitState(
    patch: Partial<Pick<TreeSnapshot<TNode>, 'expandedKeys' | 'selectedKeys' | 'checkedKeys' | 'focusedKey'>>,
    changedKeys: readonly TreeKey[],
    visibleChanged = false,
  ) {
    const current = getSnapshot()
    setSnapshot({
      ...current,
      ...patch,
      visibleItems: visibleChanged
        ? buildVisibleItems(patch.expandedKeys ?? current.expandedKeys)
        : current.visibleItems,
    }, changedKeys, visibleChanged)
  }

  function commitTreeData(treeData: readonly TNode[], mutation: TreeMutationResult) {
    const current = getSnapshot()
    const next = buildSnapshot(
      treeData,
      current.expandedKeys,
      current.selectedKeys,
      current.checkedKeys,
      current.focusedKey,
    )
    setSnapshot(next, mutation.changedKeys, true)
    options.onTreeDataChange?.(treeData, mutation)
    return mutation
  }

  function commitNodeUpdate(
    key: TreeKey,
    nextNode: TNode,
    nextTreeData: readonly TNode[],
    mutation: TreeMutationResult,
  ) {
    const item = index.items.get(key)
    const childrenField = getFieldNames().children
    if (!item || getKey(nextNode) !== key || nextNode[childrenField] !== item.node[childrenField]) {
      return commitTreeData(nextTreeData, mutation)
    }

    const nextItem: TreeItem<TNode> = {
      ...item,
      node: nextNode,
      isLeaf: isLeaf(nextNode),
      disabled: isDisabled(nextNode),
    }
    const nextItems = new Map(index.items)
    nextItems.set(key, nextItem)
    index = { ...index, items: nextItems }
    const current = getSnapshot()
    const visibleItems = current.visibleItems.map((visibleItem) =>
      visibleItem.key === key
        ? { ...nextItem, visibleIndex: visibleItem.visibleIndex }
        : visibleItem,
    )
    setSnapshot({ ...current, treeData: nextTreeData, items: nextItems, visibleItems }, [key], false)
    options.onTreeDataChange?.(nextTreeData, mutation)
    return mutation
  }

  function updateNode(
    key: TreeKey,
    patch: Partial<TNode> | ((node: TNode) => TNode),
  ): TreeMutationResult {
    const item = index.items.get(key)
    if (!item) return failMutation('update', 'Tree node was not found.')
    const nextNode = typeof patch === 'function' ? patch(item.node) : { ...item.node, ...patch }
    const nextTreeData = updateTreeNode(getSnapshot().treeData, key, () => nextNode)
    if (nextTreeData === getSnapshot().treeData) {
      return { ok: true, type: 'update', changedKeys: [] }
    }
    return commitNodeUpdate(
      key,
      nextNode,
      nextTreeData,
      { ok: true, type: 'update', changedKeys: [key] },
    )
  }

  function insertNode(input: TreeInsertInput<TNode>): TreeMutationResult {
    const key = getKey(input.node)
    if (index.items.has(key)) return failMutation('insert', 'Tree node key already exists.')
    const nextTreeData = insertTreeNode(getSnapshot().treeData, input)
    if (!nextTreeData) return failMutation('insert', 'Parent node was not found.')
    return commitTreeData(nextTreeData, {
      ok: true,
      type: 'insert',
      changedKeys: uniqueKeys([key, ...(input.parentKey === null ? [] : [input.parentKey])]),
    })
  }

  function removeNode(key: TreeKey): TreeMutationResult {
    const item = index.items.get(key)
    if (!item) return failMutation('remove', 'Tree node was not found.')
    const removedKeys = [key, ...getDescendantKeys(key)]
    const nextTreeData = removeTreeNode(getSnapshot().treeData, key)
    return commitTreeData(nextTreeData, {
      ok: true,
      type: 'remove',
      changedKeys: uniqueKeys([
        ...(item.parentKey === null ? [] : [item.parentKey]),
        ...getAncestorKeys(key),
      ]),
      removedKeys,
    })
  }

  function moveNode(input: TreeMoveInput): TreeMutationResult {
    const source = index.items.get(input.sourceKey)
    if (!source) return failMutation('move', 'Source node was not found.')
    if (input.parentKey !== null && !index.items.has(input.parentKey)) {
      return failMutation('move', 'Target parent was not found.')
    }
    if (
      input.parentKey === input.sourceKey
      || (input.parentKey !== null && getDescendantKeys(input.sourceKey).includes(input.parentKey))
    ) {
      return failMutation('move', 'Cannot move a node into its descendant.')
    }
    const withoutSource = removeTreeNode(getSnapshot().treeData, input.sourceKey)
    const nextTreeData = insertTreeNode(withoutSource, {
      parentKey: input.parentKey,
      index: input.index,
      node: source.node,
    })
    if (!nextTreeData) return failMutation('move', 'Target parent was not found.')
    return commitTreeData(nextTreeData, {
      ok: true,
      type: 'move',
      changedKeys: uniqueKeys([
        input.sourceKey,
        ...(source.parentKey === null ? [] : [source.parentKey]),
        ...(input.parentKey === null ? [] : [input.parentKey]),
      ]),
    })
  }

  function replaceChildren(parentKey: TreeKey | null, children: readonly TNode[]): TreeMutationResult {
    if (parentKey === null) {
      return commitTreeData(children, {
        ok: true,
        type: 'replace-children',
        changedKeys: children.map(getKey),
      })
    }
    if (!index.items.has(parentKey)) {
      return failMutation('replace-children', 'Parent node was not found.')
    }
    const nextTreeData = updateTreeNode(
      getSnapshot().treeData,
      parentKey,
      (node) => ({ ...node, [getFieldNames().children]: children }),
    )
    return commitTreeData(nextTreeData, {
      ok: true,
      type: 'replace-children',
      changedKeys: uniqueKeys([parentKey, ...children.map(getKey)]),
    })
  }

  function updateStateKeys(
    field: 'expandedKeys' | 'selectedKeys' | 'checkedKeys',
    keys: readonly TreeKey[],
    changedKeys: readonly TreeKey[],
  ) {
    const current = getSnapshot()
    const previous = current[field]
    const nextKeys = uniqueKeys(keys)
    if (sameKeys(previous, nextKeys)) return
    const visibleChanged = field === 'expandedKeys'
    commitState(
      { [field]: nextKeys },
      uniqueKeys([...changedKeys, ...previous, ...nextKeys]),
      visibleChanged,
    )
    if (field === 'expandedKeys') options.onExpandedKeysChange?.(nextKeys, { changedKeys })
    if (field === 'selectedKeys') options.onSelectedKeysChange?.(nextKeys, { changedKeys })
    if (field === 'checkedKeys') options.onCheckedKeysChange?.(nextKeys, { changedKeys })
  }

  function initializeStateKeys(
    field: 'expandedKeys' | 'selectedKeys' | 'checkedKeys',
    keys: readonly TreeKey[],
  ) {
    const current = getSnapshot()
    const previous = current[field]
    const nextKeys = uniqueKeys(keys)
    if (sameKeys(previous, nextKeys)) return
    commitState(
      { [field]: nextKeys },
      uniqueKeys([...previous, ...nextKeys]),
      field === 'expandedKeys',
    )
  }

  function setFocusedKey(key: TreeKey | null) {
    if (key !== null && !index.items.has(key)) return
    const previous = getSnapshot().focusedKey
    if (previous === key) return
    commitState(
      { focusedKey: key },
      uniqueKeys([...(previous === null ? [] : [previous]), ...(key === null ? [] : [key])]),
    )
    options.onFocusedKeyChange?.(key)
  }

  function getDescendantKeys(key: TreeKey) {
    const result: TreeKey[] = []
    const visit = (currentKey: TreeKey) => {
      for (const childKey of index.childrenByKey.get(currentKey) ?? []) {
        result.push(childKey)
        visit(childKey)
      }
    }
    visit(key)
    return result
  }

  function getAncestorKeys(key: TreeKey) {
    const result: TreeKey[] = []
    let parentKey = index.parentByKey.get(key) ?? null
    while (parentKey !== null) {
      result.push(parentKey)
      parentKey = index.parentByKey.get(parentKey) ?? null
    }
    return result
  }

  const controller: TreeController<TNode> = {
    getSnapshot,
    subscribe: store.subscribe,
    subscribeNode(key, listener) {
      const listeners = nodeListeners.get(key) ?? new Set<() => void>()
      listeners.add(listener)
      nodeListeners.set(key, listeners)
      return () => listeners.delete(listener)
    },
    subscribeVisible(listener) {
      visibleListeners.add(listener)
      return () => visibleListeners.delete(listener)
    },
    subscribeSelector: store.subscribeSelector,
    hasFeature: (id) => featureRuntime?.has(id) ?? false,
    getFeature: (id) => featureRuntime?.get(id),
    updateNode,
    insertNode,
    removeNode,
    moveNode,
    replaceChildren,
    updateOptions(nextOptions) {
      const previousOptions = options
      const { fieldNames, ...nextOptionValues } = nextOptions
      options = {
        ...options,
        ...nextOptionValues,
        ...(fieldNames === undefined ? {} : { fieldNames }),
      }
      const current = getSnapshot()
      const structureChanged =
        (Object.hasOwn(nextOptions, 'treeData') && nextOptions.treeData !== current.treeData) ||
        (Object.hasOwn(nextOptions, 'fieldNames') && nextOptions.fieldNames !== previousOptions.fieldNames) ||
        (Object.hasOwn(nextOptions, 'isLeaf') && nextOptions.isLeaf !== previousOptions.isLeaf)

      if (structureChanged) {
        const next = buildSnapshot(
          nextOptions.treeData ?? current.treeData,
          nextOptions.expandedKeys ?? current.expandedKeys,
          nextOptions.selectedKeys ?? current.selectedKeys,
          nextOptions.checkedKeys ?? current.checkedKeys,
          Object.hasOwn(nextOptions, 'focusedKey')
            ? nextOptions.focusedKey ?? null
            : current.focusedKey,
        )
        setSnapshot(next, uniqueKeys([...current.items.keys(), ...next.items.keys()]), true)
        return
      }

      const nextExpandedKeys = Object.hasOwn(nextOptions, 'expandedKeys')
        ? nextOptions.expandedKeys ?? []
        : current.expandedKeys
      const nextSelectedKeys = Object.hasOwn(nextOptions, 'selectedKeys')
        ? nextOptions.selectedKeys ?? []
        : current.selectedKeys
      const nextCheckedKeys = Object.hasOwn(nextOptions, 'checkedKeys')
        ? nextOptions.checkedKeys ?? []
        : current.checkedKeys
      const nextFocusedKey = Object.hasOwn(nextOptions, 'focusedKey')
        ? nextOptions.focusedKey ?? null
        : current.focusedKey
      const expandedChanged = !sameKeys(current.expandedKeys, nextExpandedKeys)
      const selectedChanged = !sameKeys(current.selectedKeys, nextSelectedKeys)
      const checkedChanged = !sameKeys(current.checkedKeys, nextCheckedKeys)
      const focusedChanged = current.focusedKey !== nextFocusedKey
      if (!expandedChanged && !selectedChanged && !checkedChanged && !focusedChanged) return
      commitState({
        expandedKeys: uniqueKeys(nextExpandedKeys),
        selectedKeys: uniqueKeys(nextSelectedKeys),
        checkedKeys: uniqueKeys(nextCheckedKeys),
        focusedKey: nextFocusedKey,
      }, uniqueKeys([
        ...(expandedChanged ? [...current.expandedKeys, ...nextExpandedKeys] : []),
        ...(selectedChanged ? [...current.selectedKeys, ...nextSelectedKeys] : []),
        ...(checkedChanged ? [...current.checkedKeys, ...nextCheckedKeys] : []),
        ...(focusedChanged
          ? [...(current.focusedKey === null ? [] : [current.focusedKey]), ...(nextFocusedKey === null ? [] : [nextFocusedKey])]
          : []),
      ]), expandedChanged)
    },
    getItem: (key) => index.items.get(key),
    // oxlint-disable-next-line unicorn/no-array-reverse -- getAncestorKeys returns a fresh array and the workspace targets ES2022.
    getPath: (key) => [...getAncestorKeys(key).reverse(), key],
    getVisibleItems: () => getSnapshot().visibleItems,
    getVisibleCount: () => getSnapshot().visibleItems.length,
    getVisibleItemAt: (itemIndex) => getSnapshot().visibleItems[itemIndex],
    getVisibleIndex(key) {
      const visibleIndex = getSnapshot().visibleItems.findIndex((item) => item.key === key)
      return visibleIndex < 0 ? undefined : visibleIndex
    },
  }

  featureRuntime = createTreeFeatureRuntime({
    getSnapshot,
    getItem: (key) => index.items.get(key),
    // oxlint-disable-next-line unicorn/no-array-reverse -- getAncestorKeys returns a fresh array and the workspace targets ES2022.
    getPath: (key) => [...getAncestorKeys(key).reverse(), key],
    updateFeatureState: (changedKeys = []) => commitState({}, changedKeys),
    configure: (featureOptions) => { options = { ...options, ...featureOptions } },
    getOptions: () => options,
    getItems: () => index.items,
    getVisibleItems: () => getSnapshot().visibleItems,
    getChildrenKeys: (key) => index.childrenByKey.get(key) ?? [],
    getAncestorKeys,
    getDescendantKeys,
    setStateKeys: updateStateKeys,
    initializeStateKeys,
    setFocusedKey,
    getFeature: (id) => featureRuntime?.get(id),
    getFieldNames,
    getKey,
    getChildren,
    updateNode,
    insertNode,
    removeNode,
    moveNode,
    replaceChildren,
  })
  featureRuntime.installAll(initialOptions.features ?? [])

  return controller
}
