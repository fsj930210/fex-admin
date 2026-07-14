import { createTreeController } from '@fex/components-core/tree/create-tree-controller'
import type { TreeController, TreeNodeData, TreeOptions } from '@fex/components-core/tree/types'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { useLazyRef } from '../../hooks/use-lazy-ref'

/** Creates one tree controller from an explicit list of core feature registrations. */
export function useTree<TNode extends TreeNodeData>(options: TreeOptions<TNode>) {
  return useTreeController(options)
}

/** TreeRoot-only adapter for owned and externally supplied controllers. */
export function useTreeController<TNode extends TreeNodeData>(
  options: TreeOptions<TNode> | undefined,
  suppliedController?: TreeController<TNode> | undefined,
) {
  const controllerRef = useLazyRef<TreeController<TNode>>(() =>
    createTreeController(options ?? { treeData: [] }),
  )
  const controller = suppliedController ?? controllerRef.current

  // A core controller is an external store. Layout synchronization makes controlled
  // framework inputs observable before the browser paints the next tree snapshot.
  useIsomorphicLayoutEffect(() => {
    if (options) controller.updateOptions(options)
  }, [controller, options])

  return controller
}
