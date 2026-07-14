import type { AsyncLoadFeatureApi } from '@fex/components-core/tree/features/async-load'
import type { CheckFeatureApi } from '@fex/components-core/tree/features/check'
import type { TreeController, TreeKey, TreeNodeData } from '@fex/components-core/tree/types'
import { createMemo } from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'

export function createTreeItem<TNode extends TreeNodeData>(tree: TreeController<TNode>, key: TreeKey) {
  const snapshot = createCoreStoreSignal({
    getSnapshot: tree.getSnapshot,
    subscribe: (listener) => tree.subscribeNode(key, listener),
  })
  return createMemo(() => {
    const check = tree.getFeature<CheckFeatureApi>('check')
    const asyncLoad = tree.getFeature<AsyncLoadFeatureApi>('async-load')
    return {
      item: tree.getItem(key),
      expanded: snapshot().expandedKeys.includes(key),
      selected: snapshot().selectedKeys.includes(key),
      checked: snapshot().checkedKeys.includes(key),
      checkedState: check?.getState(key) ?? false,
      focused: snapshot().focusedKey === key,
      loadState: asyncLoad?.getState(key) ?? 'unloaded',
      loadError: asyncLoad?.getError(key),
    }
  })
}
