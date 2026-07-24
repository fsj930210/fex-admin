<script setup lang="ts">
import { selectContentClassName } from '@fex/components-styles/select'
import { cn } from '@fex/utils'
import { computed } from 'vue'
import PopoverContent from '../popover/popover-content.vue'
import PopoverPortal from '../popover/popover-portal.vue'
import SelectList from './select-list.vue'

const props = defineProps<{ class?: string }>()
const className = computed(() => cn(selectContentClassName, props.class))
</script>
<template>
  <PopoverPortal
    ><PopoverContent
      :class="className"
      :style="{
        width: 'var(--select-content-width, var(--floating-reference-width))',
        maxWidth:
          'min(var(--floating-available-width), var(--select-content-max-width, var(--floating-reference-width)))',
      }"
      ><slot><SelectList /></slot></PopoverContent
  ></PopoverPortal>
</template>
