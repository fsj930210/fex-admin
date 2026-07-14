import type { TreeController, TreeNodeData } from '@fex/components-core/tree/types'

export const treeContextKey = Symbol('fex-tree')

export interface TreeContext<TNode extends TreeNodeData = TreeNodeData> {
  tree: TreeController<TNode>
  indent: () => number
  rowHeight: () => number
}

export function styleToString(style: Record<string, string | number | undefined>) {
  return Object.entries(style)
    .filter(([, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}:${value}`,
    )
    .join(';')
}
