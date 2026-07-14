import { effect } from '@angular/core'
import { createTreeController } from '@fex/components-core/tree/create-tree-controller'
import type { TreeController, TreeNodeData, TreeOptions } from '@fex/components-core/tree/types'
import { createCoreStoreSignal } from '../../signals/core-store-signal'

export function createTreeSignals<TNode extends TreeNodeData>(
  getOptions: () => TreeOptions<TNode>,
  suppliedController?: TreeController<TNode>,
) {
  const tree = suppliedController ?? createTreeController(getOptions())

  // The effect only synchronizes Angular inputs to the external core controller.
  effect(() => tree.updateOptions(getOptions()))

  return {
    tree,
    snapshot: createCoreStoreSignal({ getSnapshot: tree.getSnapshot, subscribe: tree.subscribe }),
    visibleItems: createCoreStoreSignal({
      getSnapshot: tree.getVisibleItems,
      subscribe: tree.subscribeVisible,
    }),
  }
}
