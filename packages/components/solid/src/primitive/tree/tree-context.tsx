import type { TreeController, TreeNodeData } from '@fex/components-core/tree/types'
import { createContext, useContext, type Accessor } from 'solid-js'

export interface TreeContextValue<TNode extends TreeNodeData> {
  tree: TreeController<TNode>
  indent: Accessor<number>
  rowHeight: Accessor<number>
}
export const TreeContext = createContext<TreeContextValue<TreeNodeData>>()
export function useTreeContext<TNode extends TreeNodeData>(component = 'Tree') {
  const context = useContext(TreeContext) as TreeContextValue<TNode> | undefined
  if (!context) throw new Error(`${component} must be used inside TreeRoot.`)
  return context
}
