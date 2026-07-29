<script setup lang="ts">
import { datePickerHeaderTitleClassName } from '@fex/components-styles/date-picker'
import { cn } from '@fex/utils'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <div data-slot="date-picker-header-title" :class="cn(datePickerHeaderTitleClassName, props.class)">
    <slot />
  </div>
</template>
