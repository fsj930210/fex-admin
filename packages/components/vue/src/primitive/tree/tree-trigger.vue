<script setup lang="ts" generic="TNode extends TreeNodeData">
import type { AsyncLoadFeatureApi } from '@fex/components-core/tree/features/async-load'
import type { ExpansionFeatureApi } from '@fex/components-core/tree/features/expansion'
import type { TreeKey, TreeNodeData } from '@fex/components-core/tree/types'
import { treeTriggerClassName } from '@fex/components-styles/tree'
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'
import { useTreeContext } from './context'
import { useTreeItem } from './use-tree-item'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ itemKey: TreeKey }>()
const attrs = useAttrs()
const { tree } = useTreeContext<TNode>('TreeTrigger')
const state = useTreeItem(tree, props.itemKey)
const expansion = () => tree.getFeature<ExpansionFeatureApi>('expansion')
const triggerClass = computed(() => cn(treeTriggerClassName, attrs.class as string | undefined))
const triggerAttrs = computed(() => {
  const { class: _class, onClick: _onClick, ...rest } = attrs
  return rest
})

function handleClick(event: MouseEvent) {
  event.stopPropagation()
  const listener = attrs.onClick
  if (typeof listener === 'function') listener(event)
  if (event.defaultPrevented) return
  if (state.value.expanded) { expansion()?.collapse(props.itemKey); return }
  const loading = tree.getFeature<AsyncLoadFeatureApi>('async-load')?.load(props.itemKey)
  if (!loading) { expansion()?.expand(props.itemKey); return }
  void loading.then((result) => { if ((result as { ok?: boolean } | undefined)?.ok) expansion()?.expand(props.itemKey) })
}
</script>

<template>
  <span v-if="!state.item || state.item.isLeaf || !expansion()" aria-hidden="true" data-slot="tree-trigger-placeholder" class="size-5 shrink-0" />
  <button
    v-else
    v-bind="triggerAttrs"
    type="button"
    data-slot="tree-trigger"
    :aria-expanded="state.expanded"
    :class="triggerClass"
    @click="handleClick"
  >
    <slot>
      <svg aria-hidden="true" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6" /></svg>
    </slot>
  </button>
</template>
