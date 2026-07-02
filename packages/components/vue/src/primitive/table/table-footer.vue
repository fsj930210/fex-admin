<script setup lang="ts">
import { tableFooterClassName } from '@fex/components-styles/table'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
</script>

<template>
  <tfoot v-bind="$attrs" data-slot="table-footer" :class="cn(tableFooterClassName, props.class)">
    <slot />
  </tfoot>
</template>

