<script setup lang="ts">
import { paginationTextClassName } from '@fex/components-styles/pagination'
import { ChevronLeftIcon } from '../../icon/chevron'
import PaginationLink from './pagination-link.vue'

withDefaults(defineProps<{ text?: string }>(), { text: 'Previous' })
</script>

<template>
  <PaginationLink v-bind="$attrs" aria-label="Go to previous page" size="default">
    <ChevronLeftIcon />
    <span :class="paginationTextClassName">{{ text }}</span>
  </PaginationLink>
</template>

