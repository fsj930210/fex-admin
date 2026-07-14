<script setup lang="ts" generic="TNode extends TreeNodeData">
import type { TreeNodeData } from '@fex/components-core/tree/types'
import { treeViewportClassName } from '@fex/components-styles/tree'
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'
import { useTreeContext } from './context'
import { useTreeVisibleItems } from './use-tree-visible-items'

defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const { tree } = useTreeContext<TNode>('TreeViewport')
const items = useTreeVisibleItems(tree)
const viewportClass = computed(() => cn(treeViewportClassName, attrs.class as string | undefined))
const viewportAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})
</script>

<template>
  <div v-bind="viewportAttrs" data-slot="tree-viewport" :class="viewportClass">
    <slot v-for="item in items" :key="item.key" :item="item" :tree="tree" />
  </div>
</template>
