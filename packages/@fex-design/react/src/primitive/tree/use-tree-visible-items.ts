import type { TreeController, TreeNodeData } from '@fex-design/core/tree/types'
import { useSyncExternalStore } from 'react'

export function useTreeVisibleItems<TNode extends TreeNodeData>(tree: TreeController<TNode>) {
  return useSyncExternalStore(tree.subscribeVisible, tree.getVisibleItems, tree.getVisibleItems)
}
