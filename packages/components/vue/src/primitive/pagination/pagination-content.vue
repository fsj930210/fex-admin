<script setup lang="ts">
import { paginationContentClassName } from '@fex/components-styles/pagination'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
</script>

<template>
  <ul v-bind="$attrs" data-slot="pagination-content" :class="cn(paginationContentClassName, props.class)">
    <slot />
  </ul>
</template>

