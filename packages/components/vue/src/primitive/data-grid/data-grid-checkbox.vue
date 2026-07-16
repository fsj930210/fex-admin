<script setup lang="ts">
import type { CheckboxCheckedState } from '@fex/components-core/checkbox/types'
import Checkbox from '../../ui/checkbox/checkbox.vue'
const props = defineProps<{
  checked: CheckboxCheckedState
  disabled?: boolean
  ariaLabel?: string
}>()
const emit = defineEmits<{ change: [value: CheckboxCheckedState] }>()
</script>
<template>
  <Checkbox
    :checked="props.checked"
    :disabled="props.disabled"
    :aria-label="props.ariaLabel"
    @checked-change="(value) => emit('change', value)"
  />
</template>
