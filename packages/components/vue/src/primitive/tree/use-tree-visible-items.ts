import type { TreeController, TreeNodeData } from '@fex/components-core/tree/types'
import { useCoreStore } from '../../composables/use-core-store'

export function useTreeVisibleItems<TNode extends TreeNodeData>(tree: TreeController<TNode>) {
  return useCoreStore({
    getSnapshot: tree.getVisibleItems,
    subscribe: tree.subscribeVisible,
  })
}
