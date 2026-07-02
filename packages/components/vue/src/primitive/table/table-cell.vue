<script setup lang="ts">
import { tableCellClassName } from '@fex/components-styles/table'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
</script>

<template>
  <td v-bind="$attrs" data-slot="table-cell" :class="cn(tableCellClassName, props.class)">
    <slot />
  </td>
</template>

