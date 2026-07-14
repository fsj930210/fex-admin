import type { TreeController, TreeNodeData } from '@fex/components-core/tree/types'
import { createContext, use } from 'react'

export interface TreeContextValue<TNode extends TreeNodeData = TreeNodeData> {
  tree: TreeController<TNode>
  indent: number
  rowHeight: number
}

export const TreeContext = createContext<TreeContextValue | null>(null)

export function useTreeContext<TNode extends TreeNodeData>() {
  const context = use(TreeContext)
  if (!context) {
    throw new Error('Tree primitives must be rendered inside TreeRoot.')
  }
  return context as TreeContextValue<TNode>
}
