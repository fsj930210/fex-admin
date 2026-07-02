<script setup lang="ts">
import { tableHeadClassName } from '@fex/components-styles/table'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
</script>

<template>
  <th v-bind="$attrs" data-slot="table-head" :class="cn(tableHeadClassName, props.class)">
    <slot />
  </th>
</template>

