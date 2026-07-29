<script setup lang="ts">
import { datePickerPresetClassName } from '@fex/components-styles/date-picker'
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'
import Button from '../button/button.vue'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const className = computed(() => cn(datePickerPresetClassName, attrs.class as string | undefined))
</script>

<template>
  <Button data-slot="date-picker-preset" v-bind="{ ...attrs, class: undefined }" :class="className">
    <slot />
  </Button>
</template>
