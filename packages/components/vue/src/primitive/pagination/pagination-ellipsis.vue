<script setup lang="ts">
import { paginationEllipsisClassName, paginationSrOnlyClassName } from '@fex/components-styles/pagination'
import { cn } from '@fex/utils'
import { EllipsisIcon } from '../../icon/more'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
</script>

<template>
  <span v-bind="$attrs" aria-hidden="true" data-slot="pagination-ellipsis" :class="cn(paginationEllipsisClassName, props.class)">
    <EllipsisIcon />
    <span :class="paginationSrOnlyClassName">More pages</span>
  </span>
</template>

