<script setup lang="ts">
import {
  collapseContentInnerClassName,
  collapseContentOuterClassName,
} from '@fex-design/styles/collapse'
import { cn } from '@fex/utils'
import { computed, inject, useAttrs } from 'vue'
import { collapseContextKey, collapseItemContextKey } from './context'

defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const collapse = inject(collapseContextKey)
const item = inject(collapseItemContextKey)
if (!collapse || !item) throw new Error('CollapseContent must be used inside CollapseItem.')
const expanded = computed(() => collapse.isExpanded(item.value))
const className = computed(() =>
  cn(collapseContentInnerClassName({ variant: collapse.variant() }), attrs.class as string),
)
</script>

<template>
  <div
    data-slot="collapse-content-outer"
    :data-state="expanded ? 'open' : 'closed'"
    :class="collapseContentOuterClassName"
  >
    <div
      v-bind="{ ...attrs, class: undefined }"
      :id="item.contentId"
      role="region"
      :aria-labelledby="item.triggerId"
      :aria-hidden="!expanded"
      data-slot="collapse-content"
      :data-state="expanded ? 'open' : 'closed'"
      :class="className"
    >
      <slot :expanded="expanded" />
    </div>
  </div>
</template>
