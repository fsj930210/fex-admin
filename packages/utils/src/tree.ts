export type TreeKey = string | number

export type TreeWalkOrder = 'dfs' | 'bfs'

export interface TreeOptions<TNode, TKey extends TreeKey = TreeKey> {
  getKey?: (node: TNode) => TKey
  getChildren?: (node: TNode) => readonly TNode[] | undefined
}

export interface TreeVisitInfo<TNode, TKey extends TreeKey = TreeKey> {
  node: TNode
  key: TKey
  parent?: TNode
  parentKey?: TKey
  level: number
  index: number
  path: TNode[]
  keyPath: TKey[]
  hasChildren: boolean
}

export interface FlattenTreeNode<TNode, TKey extends TreeKey = TreeKey> extends TreeVisitInfo<
  TNode,
  TKey
> {}

type QueueItem<TNode, TKey extends TreeKey> = {
  node: TNode
  key: TKey
  parent?: TNode
  parentKey?: TKey
  level: number
  index: number
  path: TNode[]
  keyPath: TKey[]
}

function defaultGetKey<TNode, TKey extends TreeKey>(node: TNode): TKey {
  return (node as { key: TKey }).key
}

function defaultGetChildren<TNode>(node: TNode): readonly TNode[] | undefined {
  return (node as { children?: readonly TNode[] }).children
}

function resolveTreeOptions<TNode, TKey extends TreeKey>(options: TreeOptions<TNode, TKey> = {}) {
  return {
    getKey: options.getKey ?? defaultGetKey<TNode, TKey>,
    getChildren: options.getChildren ?? defaultGetChildren<TNode>,
  }
}

function createVisitInfo<TNode, TKey extends TreeKey>(
  item: QueueItem<TNode, TKey>,
  getChildren: (node: TNode) => readonly TNode[] | undefined,
): TreeVisitInfo<TNode, TKey> {
  const children = getChildren(item.node)

  const info: TreeVisitInfo<TNode, TKey> = {
    node: item.node,
    key: item.key,
    level: item.level,
    index: item.index,
    path: item.path,
    keyPath: item.keyPath,
    hasChildren: Boolean(children?.length),
  }

  if (item.parent !== undefined) {
    info.parent = item.parent
  }
  if (item.parentKey !== undefined) {
    info.parentKey = item.parentKey
  }

  return info
}

function createRootQueue<TNode, TKey extends TreeKey>(
  nodes: readonly TNode[],
  getKey: (node: TNode) => TKey,
): QueueItem<TNode, TKey>[] {
  return nodes.map((node, index) => {
    const key = getKey(node)

    return {
      node,
      key,
      level: 0,
      index,
      path: [node],
      keyPath: [key],
    }
  })
}

function createChildQueueItem<TNode, TKey extends TreeKey>(
  child: TNode,
  childKey: TKey,
  parent: QueueItem<TNode, TKey>,
  parentKey: TKey,
  index: number,
): QueueItem<TNode, TKey> {
  return {
    node: child,
    key: childKey,
    parent: parent.node,
    parentKey,
    level: parent.level + 1,
    index,
    path: [...parent.path, child],
    keyPath: [...parent.keyPath, childKey],
  }
}

function createMapperInfo<TNode, TKey extends TreeKey>(
  info: TreeVisitInfo<TNode, TKey>,
): Omit<TreeVisitInfo<TNode, TKey>, 'node' | 'hasChildren'> {
  const mapperInfo: Omit<TreeVisitInfo<TNode, TKey>, 'node' | 'hasChildren'> = {
    key: info.key,
    level: info.level,
    index: info.index,
    path: info.path,
    keyPath: info.keyPath,
  }

  if (info.parent !== undefined) {
    mapperInfo.parent = info.parent
  }
  if (info.parentKey !== undefined) {
    mapperInfo.parentKey = info.parentKey
  }

  return mapperInfo
}

export function walkTreeDfs<TNode, TKey extends TreeKey = TreeKey>(
  nodes: readonly TNode[],
  visitor: (info: TreeVisitInfo<TNode, TKey>) => void | false,
  options?: TreeOptions<TNode, TKey>,
) {
  const { getKey, getChildren } = resolveTreeOptions(options)

  function visit(item: QueueItem<TNode, TKey>): false | undefined {
    const info = createVisitInfo(item, getChildren)
    if (visitor(info) === false) {
      return false
    }

    const children = getChildren(item.node)
    if (!children?.length) {
      return undefined
    }

    for (const [index, child] of children.entries()) {
      const childKey = getKey(child)
      const shouldContinue = visit(createChildQueueItem(child, childKey, item, info.key, index))

      if (shouldContinue === false) {
        return false
      }
    }

    return undefined
  }

  for (const item of createRootQueue(nodes, getKey)) {
    if (visit(item) === false) {
      break
    }
  }
}

export function walkTreeBfs<TNode, TKey extends TreeKey = TreeKey>(
  nodes: readonly TNode[],
  visitor: (info: TreeVisitInfo<TNode, TKey>) => void | false,
  options?: TreeOptions<TNode, TKey>,
) {
  const { getKey, getChildren } = resolveTreeOptions(options)
  const queue = createRootQueue(nodes, getKey)

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const item = queue[cursor]
    if (!item) {
      continue
    }
    const info = createVisitInfo(item, getChildren)
    if (visitor(info) === false) {
      break
    }

    const children = getChildren(item.node)
    if (!children?.length) {
      continue
    }

    for (const [index, child] of children.entries()) {
      const childKey = getKey(child)
      queue.push(createChildQueueItem(child, childKey, item, info.key, index))
    }
  }
}

export function flattenTree<TNode, TKey extends TreeKey = TreeKey>(
  nodes: readonly TNode[],
  options: TreeOptions<TNode, TKey> & { order?: TreeWalkOrder } = {},
): FlattenTreeNode<TNode, TKey>[] {
  const result: FlattenTreeNode<TNode, TKey>[] = []
  const walker = options.order === 'bfs' ? walkTreeBfs : walkTreeDfs

  walker(
    nodes,
    (info) => {
      result.push(info)
    },
    options,
  )

  return result
}

export function findTreeNode<TNode, TKey extends TreeKey = TreeKey>(
  nodes: readonly TNode[],
  predicate: (info: TreeVisitInfo<TNode, TKey>) => boolean,
  options?: TreeOptions<TNode, TKey> & { order?: TreeWalkOrder },
): TreeVisitInfo<TNode, TKey> | undefined {
  let matched: TreeVisitInfo<TNode, TKey> | undefined
  const walker = options?.order === 'bfs' ? walkTreeBfs : walkTreeDfs

  walker(
    nodes,
    (info) => {
      if (!predicate(info)) {
        return undefined
      }

      matched = info
      return false
    },
    options,
  )

  return matched
}

export function getTreeNodeByKey<TNode, TKey extends TreeKey = TreeKey>(
  nodes: readonly TNode[],
  key: TKey,
  options?: TreeOptions<TNode, TKey>,
) {
  return findTreeNode(nodes, (info) => Object.is(info.key, key), options)
}

export function findTreePath<TNode, TKey extends TreeKey = TreeKey>(
  nodes: readonly TNode[],
  predicate: (info: TreeVisitInfo<TNode, TKey>) => boolean,
  options?: TreeOptions<TNode, TKey>,
) {
  return findTreeNode(nodes, predicate, options)?.path
}

export function getTreeKeyPath<TNode, TKey extends TreeKey = TreeKey>(
  nodes: readonly TNode[],
  key: TKey,
  options?: TreeOptions<TNode, TKey>,
) {
  return getTreeNodeByKey(nodes, key, options)?.keyPath
}

export function getTreeParentMap<TNode, TKey extends TreeKey = TreeKey>(
  nodes: readonly TNode[],
  options?: TreeOptions<TNode, TKey>,
) {
  const parentMap = new Map<TKey, TKey | undefined>()

  walkTreeDfs(
    nodes,
    (info) => {
      parentMap.set(info.key, info.parentKey)
    },
    options,
  )

  return parentMap
}

export function mapTree<TNode, TResult, TKey extends TreeKey = TreeKey>(
  nodes: readonly TNode[],
  mapper: (node: TNode, info: Omit<TreeVisitInfo<TNode, TKey>, 'node' | 'hasChildren'>) => TResult,
  options: TreeOptions<TNode, TKey> & {
    setChildren?: (node: TResult, children: TResult[]) => TResult
    getMappedChildren?: (node: TResult) => readonly TResult[] | undefined
  } = {},
): TResult[] {
  const { getKey, getChildren } = resolveTreeOptions(options)
  const setChildren =
    options.setChildren ??
    ((node: TResult, children: TResult[]) => ({ ...(node as object), children }) as TResult)

  function mapNode(item: QueueItem<TNode, TKey>): TResult {
    const info = createVisitInfo(item, getChildren)
    const mapped = mapper(item.node, createMapperInfo(info))
    const children = getChildren(item.node)

    if (!children?.length) {
      return mapped
    }

    const mappedChildren = children.map((child, index) => {
      const childKey = getKey(child)
      return mapNode(createChildQueueItem(child, childKey, item, info.key, index))
    })

    return setChildren(mapped, mappedChildren)
  }

  return createRootQueue(nodes, getKey).map(mapNode)
}

export function filterTree<TNode, TKey extends TreeKey = TreeKey>(
  nodes: readonly TNode[],
  predicate: (info: TreeVisitInfo<TNode, TKey>) => boolean,
  options: TreeOptions<TNode, TKey> & {
    setChildren?: (node: TNode, children: TNode[]) => TNode
  } = {},
): TNode[] {
  const { getKey, getChildren } = resolveTreeOptions(options)
  const setChildren =
    options.setChildren ??
    ((node: TNode, children: TNode[]) => ({ ...(node as object), children }) as TNode)

  function filterNode(item: QueueItem<TNode, TKey>): TNode | undefined {
    const info = createVisitInfo(item, getChildren)
    const children = getChildren(item.node) ?? []
    const filteredChildren: TNode[] = []

    for (const [index, child] of children.entries()) {
      const childKey = getKey(child)
      const filteredChild = filterNode(createChildQueueItem(child, childKey, item, info.key, index))

      if (filteredChild !== undefined) {
        filteredChildren.push(filteredChild)
      }
    }

    if (!predicate(info) && filteredChildren.length === 0) {
      return undefined
    }

    return filteredChildren.length > 0 ? setChildren(item.node, filteredChildren) : item.node
  }

  return createRootQueue(nodes, getKey)
    .map(filterNode)
    .filter((node): node is TNode => node !== undefined)
}
