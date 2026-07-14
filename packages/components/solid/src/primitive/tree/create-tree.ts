import { createTreeController } from '@fex/components-core/tree/create-tree-controller'
import type { TreeController, TreeNodeData, TreeOptions } from '@fex/components-core/tree/types'
import { createEffect } from 'solid-js'

export function createTree<TNode extends TreeNodeData>(getOptions: () => TreeOptions<TNode>) {
  return createTreeAdapter(getOptions)
}
export function createTreeAdapter<TNode extends TreeNodeData>(
  getOptions: () => TreeOptions<TNode> | undefined,
  suppliedController?: TreeController<TNode>,
) {
  const controller = suppliedController ?? createTreeController(getOptions() ?? { treeData: [] })
  // The effect only synchronizes Solid inputs to the external core store.
  // User interactions call controller actions directly instead of watching state changes.
  createEffect(() => {
    const options = getOptions()
    if (options) controller.updateOptions(options)
  })
  return controller
}
