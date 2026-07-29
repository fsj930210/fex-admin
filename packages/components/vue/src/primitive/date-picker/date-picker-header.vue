<script setup lang="ts">
import { datePickerHeaderClassName } from '@fex/components-styles/date-picker'
import { cn } from '@fex/utils'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <div data-slot="date-picker-header" :class="cn(datePickerHeaderClassName, props.class)">
    <slot />
  </div>
</template>
