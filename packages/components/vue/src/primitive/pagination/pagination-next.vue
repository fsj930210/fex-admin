<script setup lang="ts">
import { paginationTextClassName } from '@fex/components-styles/pagination'
import { ChevronRightIcon } from '../../icon/chevron'
import PaginationLink from './pagination-link.vue'

withDefaults(defineProps<{ text?: string }>(), { text: 'Next' })
</script>

<template>
  <PaginationLink v-bind="$attrs" aria-label="Go to next page" size="default">
    <span :class="paginationTextClassName">{{ text }}</span>
    <ChevronRightIcon />
  </PaginationLink>
</template>

