import type { AsyncLoadFeatureApi } from '@fex/components-core/tree/features/async-load'
import type { CheckFeatureApi } from '@fex/components-core/tree/features/check'
import type {
  TreeController,
  TreeKey,
  TreeNodeData,
} from '@fex/components-core/tree/types'
import { computed } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'

export function useTreeItem<TNode extends TreeNodeData>(tree: TreeController<TNode>, key: TreeKey) {
  const snapshot = useCoreStore({
    getSnapshot: tree.getSnapshot,
    subscribe: (listener) => tree.subscribeNode(key, listener),
  })

  return computed(() => {
    const check = tree.getFeature<CheckFeatureApi>('check')
    const asyncLoad = tree.getFeature<AsyncLoadFeatureApi>('async-load')
    return {
      item: tree.getItem(key),
      expanded: snapshot.value.expandedKeys.includes(key),
      selected: snapshot.value.selectedKeys.includes(key),
      checked: snapshot.value.checkedKeys.includes(key),
      checkedState: check?.getState(key) ?? false,
      focused: snapshot.value.focusedKey === key,
      loadState: asyncLoad?.getState(key) ?? 'unloaded',
      loadError: asyncLoad?.getError(key),
    }
  })
}
