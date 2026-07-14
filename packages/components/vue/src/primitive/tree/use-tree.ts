import { createTreeController } from '@fex/components-core/tree/create-tree-controller'
import type { TreeController, TreeNodeData, TreeOptions } from '@fex/components-core/tree/types'
import { shallowRef, watchEffect, type ShallowRef } from 'vue'

export function useTree<TNode extends TreeNodeData>(options: () => TreeOptions<TNode>) {
  return useTreeController(options)
}

export function useTreeController<TNode extends TreeNodeData>(
  getOptions: () => TreeOptions<TNode> | undefined,
  suppliedController?: TreeController<TNode> | undefined,
): TreeController<TNode> {
  const ownedController: ShallowRef<TreeController<TNode>> = shallowRef(
    createTreeController(getOptions() ?? { treeData: [] }),
  )
  const controller = suppliedController ?? ownedController.value

  // The core controller is an external store. This watcher only synchronizes reactive
  // Vue inputs across that framework boundary; interaction flows remain event-driven.
  watchEffect(() => {
    const options = getOptions()
    if (options) controller.updateOptions(options)
  })

  return controller
}
