import type { TreeController, TreeNodeData } from '@fex/components-core/tree/types'
import type { ComputedRef, InjectionKey } from 'vue'
import { inject } from 'vue'

export interface TreeContextValue<TNode extends TreeNodeData> {
  tree: TreeController<TNode>
  indent: ComputedRef<number>
  rowHeight: ComputedRef<number>
}

export const treeContextKey = Symbol('fex-tree') as InjectionKey<TreeContextValue<TreeNodeData>>

export function useTreeContext<TNode extends TreeNodeData>(component = 'Tree') {
  const context = inject(treeContextKey, null) as TreeContextValue<TNode> | null
  if (!context) throw new Error(`${component} must be used inside TreeRoot.`)
  return context
}
