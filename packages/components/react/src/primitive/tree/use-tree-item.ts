import type { AsyncLoadFeatureApi } from '@fex/components-core/tree/features/async-load'
import type { CheckFeatureApi } from '@fex/components-core/tree/features/check'
import type {
  TreeCheckedState,
  TreeController,
  TreeKey,
  TreeLoadState,
  TreeNodeData,
} from '@fex/components-core/tree/types'
import { useSyncExternalStore } from 'react'

export interface TreeItemState<TNode extends TreeNodeData> {
  item: ReturnType<TreeController<TNode>['getItem']>
  expanded: boolean
  selected: boolean
  checked: boolean
  checkedState: TreeCheckedState
  focused: boolean
  loadState: TreeLoadState
  loadError: unknown
}

export function useTreeItem<TNode extends TreeNodeData>(
  tree: TreeController<TNode>,
  key: TreeKey,
): TreeItemState<TNode> {
  const snapshot = useSyncExternalStore(
    (listener) => tree.subscribeNode(key, listener),
    tree.getSnapshot,
    tree.getSnapshot,
  )
  const check = tree.getFeature<CheckFeatureApi>('check')
  const asyncLoad = tree.getFeature<AsyncLoadFeatureApi>('async-load')

  return {
    item: tree.getItem(key),
    expanded: snapshot.expandedKeys.includes(key),
    selected: snapshot.selectedKeys.includes(key),
    checked: snapshot.checkedKeys.includes(key),
    checkedState: check?.getState(key) ?? false,
    focused: snapshot.focusedKey === key,
    loadState: asyncLoad?.getState(key) ?? 'unloaded',
    loadError: asyncLoad?.getError(key),
  }
}
