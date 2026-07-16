<script setup lang="ts" generic="TNode extends TreeNodeData">
import type { CheckFeatureApi } from '@fex/components-core/tree/features/check'
import type { ExpansionFeatureApi } from '@fex/components-core/tree/features/expansion'
import type { FocusFeatureApi } from '@fex/components-core/tree/features/focus'
import type { SelectionFeatureApi } from '@fex/components-core/tree/features/selection'
import type { TreeController, TreeNodeData, TreeOptions } from '@fex/components-core/tree/types'
import { treeRootClassName } from '@fex/components-styles/tree'
import { cn } from '@fex/utils'
import { computed, provide, useAttrs } from 'vue'
import { treeContextKey, type TreeContextValue } from './context'
import { useTreeController } from './use-tree'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  options?: TreeOptions<TNode>
  controller?: TreeController<TNode>
  indent?: number
  rowHeight?: number
}>(), { indent: 16, rowHeight: 32 })
const attrs = useAttrs()
const tree = useTreeController(() => props.options ?? (props.controller ? undefined : { treeData: [] }), props.controller)
const indent = computed(() => props.indent)
const rowHeight = computed(() => props.rowHeight)
provide(treeContextKey, { tree, indent, rowHeight } as unknown as TreeContextValue<TreeNodeData>)

const rootAttrs = computed(() => {
  const { class: _class, style: _style, onKeydown: _onKeydown, ...rest } = attrs
  return rest
})
const rootClass = computed(() => cn(treeRootClassName, attrs.class as string | undefined))
const rootStyle = computed(() => [attrs.style, { '--tree-indent': `${indent.value}px` }])
const selection = () => tree.getFeature<SelectionFeatureApi>('selection')

function handleKeydown(event: KeyboardEvent) {
  const listener = attrs.onKeydown
  if (typeof listener === 'function') listener(event)
  if (event.defaultPrevented || event.isComposing || !tree.hasFeature('keyboard')) return
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
  const visibleItems = tree.getVisibleItems()
  const expansion = tree.getFeature<ExpansionFeatureApi>('expansion')
  const check = tree.getFeature<CheckFeatureApi>('check')
  const focus = tree.getFeature<FocusFeatureApi>('focus')
  const focusedIndex = visibleItems.findIndex((item) => item.key === tree.getSnapshot().focusedKey)
  const focusedItem = focusedIndex >= 0 ? visibleItems[focusedIndex] : undefined
  const focusAt = (index: number) => focus?.focus(visibleItems[index]?.key ?? null)

  if (event.key === 'ArrowDown') { event.preventDefault(); focusAt(Math.min(focusedIndex + 1, visibleItems.length - 1)) }
  else if (event.key === 'ArrowUp') { event.preventDefault(); focusAt(Math.max(focusedIndex - 1, 0)) }
  else if (event.key === 'Home') { event.preventDefault(); focusAt(0) }
  else if (event.key === 'End') { event.preventDefault(); focusAt(visibleItems.length - 1) }
  else if (event.key === 'ArrowRight' && focusedItem) {
    event.preventDefault()
    if (!focusedItem.isLeaf && !tree.getSnapshot().expandedKeys.includes(focusedItem.key)) expansion?.expand(focusedItem.key)
    else focus?.focus(tree.getVisibleItemAt(focusedIndex + 1)?.key ?? focusedItem.key)
  } else if (event.key === 'ArrowLeft' && focusedItem) {
    event.preventDefault()
    if (tree.getSnapshot().expandedKeys.includes(focusedItem.key)) expansion?.collapse(focusedItem.key)
    else focus?.focus(focusedItem.parentKey)
  } else if (event.key === 'Enter' && focusedItem) selection()?.toggle(focusedItem.key)
  else if (event.key === ' ' && focusedItem) {
    event.preventDefault()
    check?.check(focusedItem.key, !tree.getSnapshot().checkedKeys.includes(focusedItem.key))
  }
}
</script>

<template>
  <div
    v-bind="rootAttrs"
    role="tree"
    data-slot="tree"
    tabindex="0"
    :aria-multiselectable="selection()?.isMultiple() || undefined"
    :class="rootClass"
    :style="rootStyle"
    @keydown="handleKeydown"
  >
    <slot :tree="tree" />
  </div>
</template>
