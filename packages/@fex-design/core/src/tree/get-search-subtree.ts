import type { TreeFieldNames, TreeNodeData, TreeSearchSubtreeOptions } from './types'

const defaultChildrenField = 'children'

function getChildren<TNode extends TreeNodeData>(node: TNode, fieldNames: TreeFieldNames) {
  const value = node[fieldNames.children ?? defaultChildrenField]
  return Array.isArray(value) ? (value as readonly TNode[]) : []
}

/**
 * Returns a structural-sharing search subtree. A returned node is either a match or an
 * ancestor of a match; unrelated descendants are deliberately omitted.
 */
export function getSearchSubtree<TNode extends TreeNodeData>(
  treeData: readonly TNode[],
  fieldNames: TreeFieldNames,
  options: TreeSearchSubtreeOptions<TNode>,
): readonly TNode[] {
  if (!options.keyword.trim()) {
    return treeData
  }

  const childrenField = fieldNames.children ?? defaultChildrenField

  const visit = (node: TNode): TNode | undefined => {
    const nextChildren = getChildren(node, fieldNames)
      .map(visit)
      .filter((child): child is TNode => child !== undefined)
    const matched = options.filterTreeNode(node, options.keyword)
    if (!matched && nextChildren.length === 0) {
      return undefined
    }
    if (nextChildren.length === getChildren(node, fieldNames).length) {
      return node
    }
    return { ...node, [childrenField]: nextChildren }
  }

  return treeData.map(visit).filter((node): node is TNode => node !== undefined)
}
