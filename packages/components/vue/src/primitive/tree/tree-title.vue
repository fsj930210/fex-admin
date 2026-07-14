<script setup lang="ts">
import { treeTitleClassName } from '@fex/components-styles/tree'
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const titleClass = computed(() => cn(treeTitleClassName, attrs.class as string | undefined))
const titleAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})
</script>
<template><span v-bind="titleAttrs" data-slot="tree-title" :class="titleClass"><slot /></span></template>
