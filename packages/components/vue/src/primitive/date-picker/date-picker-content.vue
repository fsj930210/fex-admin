<script setup lang="ts">
import { datePickerContentClassName } from '@fex/components-styles/date-picker'
import { cn } from '@fex/utils'
import PopoverContent from '../popover/popover-content.vue'
import PopoverPortal from '../popover/popover-portal.vue'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <PopoverPortal>
    <PopoverContent :class="cn(datePickerContentClassName, props.class)">
      <slot />
    </PopoverContent>
  </PopoverPortal>
</template>
