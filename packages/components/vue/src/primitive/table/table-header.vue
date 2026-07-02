<script setup lang="ts">
import { tableHeaderClassName } from '@fex/components-styles/table'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
</script>

<template>
  <thead v-bind="$attrs" data-slot="table-header" :class="cn(tableHeaderClassName, props.class)">
    <slot />
  </thead>
</template>

