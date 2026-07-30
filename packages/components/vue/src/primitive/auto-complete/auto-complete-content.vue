<script setup lang="ts">
import { autoCompleteContentClassName } from '@fex/components-styles/auto-complete'
import { cn } from '@fex/utils'
import { computed } from 'vue'
import PopoverContent from '../popover/popover-content.vue'
import PopoverPortal from '../popover/popover-portal.vue'
import AutoCompleteList from './auto-complete-list.vue'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string }>()
const className = computed(() => cn(autoCompleteContentClassName, props.class))
</script>
<template>
  <PopoverPortal><PopoverContent v-bind="$attrs" :class="className" :style="{ width: 'var(--auto-complete-content-width,var(--floating-reference-width))', maxWidth: 'var(--auto-complete-content-width,var(--floating-reference-width))' }"><slot><AutoCompleteList /></slot></PopoverContent></PopoverPortal>
</template>
