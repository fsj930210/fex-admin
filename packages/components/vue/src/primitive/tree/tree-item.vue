<script setup lang="ts" generic="TNode extends TreeNodeData">
import type { CheckFeatureApi } from '@fex/components-core/tree/features/check'
import type { ExpansionFeatureApi } from '@fex/components-core/tree/features/expansion'
import type { FocusFeatureApi } from '@fex/components-core/tree/features/focus'
import type { SelectionFeatureApi } from '@fex/components-core/tree/features/selection'
import type { TreeKey, TreeNodeData } from '@fex/components-core/tree/types'
import { treeItemClassName } from '@fex/components-styles/tree'
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'
import { useTreeContext } from './context'
import { useTreeItem } from './use-tree-item'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ itemKey: TreeKey; block?: boolean }>()
const attrs = useAttrs()
const { tree, indent, rowHeight } = useTreeContext<TNode>('TreeItem')
const state = useTreeItem(tree, props.itemKey)
const actions = {
  expand: () => tree.getFeature<ExpansionFeatureApi>('expansion')?.expand(props.itemKey),
  collapse: () => tree.getFeature<ExpansionFeatureApi>('expansion')?.collapse(props.itemKey),
  toggleExpanded: () => tree.getFeature<ExpansionFeatureApi>('expansion')?.toggle(props.itemKey),
  toggleSelected: () => tree.getFeature<SelectionFeatureApi>('selection')?.toggle(props.itemKey),
  toggleChecked: () => tree.getFeature<CheckFeatureApi>('check')?.check(props.itemKey, !state.value.checked),
}
const itemProps = computed(() => {
  const item = state.value.item
  if (!item) return {}
  const { class: className, style, onClick, onFocus, ...rest } = attrs
  return {
    ...rest,
    role: 'treeitem',
    tabindex: state.value.focused ? 0 : -1,
    'aria-level': item.depth + 1,
    'aria-expanded': item.isLeaf ? undefined : state.value.expanded,
    'aria-selected': state.value.selected || undefined,
    'aria-checked': state.value.checkedState === 'indeterminate' ? 'mixed' : state.value.checked || undefined,
    'aria-disabled': item.disabled || undefined,
    'aria-posinset': item.index + 1,
    'data-key': String(item.key),
    'data-selected': state.value.selected || undefined,
    'data-expanded': state.value.expanded || undefined,
    'data-checked': state.value.checked || undefined,
    'data-disabled': item.disabled || undefined,
    'data-leaf': item.isLeaf || undefined,
    'data-block': props.block || undefined,
    class: cn(treeItemClassName(), className as string | undefined),
    style: [style, {
      height: `${rowHeight.value}px`,
      marginInlineStart: `${item.depth * indent.value}px`,
      paddingInlineStart: '4px',
      '--tree-item-inline-start': '4px',
    }],
    onFocus: (event: FocusEvent) => {
      if (typeof onFocus === 'function') onFocus(event)
      tree.getFeature<FocusFeatureApi>('focus')?.focus(item.key)
    },
    onClick: (event: MouseEvent) => {
      if (typeof onClick === 'function') onClick(event)
      if (!event.defaultPrevented && !item.disabled) actions.toggleSelected()
    },
  }
})
</script>

<template>
  <slot
    v-if="state.item"
    :item="state.item"
    :item-props="itemProps"
    :expanded="state.expanded"
    :selected="state.selected"
    :checked="state.checked"
    :checked-state="state.checkedState"
    :focused="state.focused"
    :load-state="state.loadState"
    :load-error="state.loadError"
    :actions="actions"
  >
    <div v-bind="itemProps" />
  </slot>
</template>
