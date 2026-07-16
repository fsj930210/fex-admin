import { createTreeController } from '@fex/components-core/tree/create-tree-controller'
import type {
  TreeController,
  TreeKey,
  TreeNodeData,
  TreeOptions,
} from '@fex/components-core/tree/types'
import { readableCoreStore } from '../../stores/core-store'

export function createTreeStore<TNode extends TreeNodeData>(
  options: TreeOptions<TNode>,
  suppliedController?: TreeController<TNode>,
) {
  const tree = suppliedController ?? createTreeController(options)
  if (suppliedController) tree.updateOptions(options)
  return {
    tree,
    snapshot: readableCoreStore({ getSnapshot: tree.getSnapshot, subscribe: tree.subscribe }),
    visibleItems: readableCoreStore({
      getSnapshot: tree.getVisibleItems,
      subscribe: tree.subscribeVisible,
    }),
    item(key: TreeKey) {
      return readableCoreStore({
        getSnapshot: () => tree.getItem(key),
        subscribe: (listener) => tree.subscribeNode(key, listener),
      })
    },
  }
}
