<script setup lang="ts">
import { paginationClassName } from '@fex/components-styles/pagination'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
</script>

<template>
  <nav v-bind="$attrs" aria-label="pagination" data-slot="pagination" :class="cn(paginationClassName, props.class)">
    <slot />
  </nav>
</template>

