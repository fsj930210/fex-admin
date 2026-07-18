<script setup lang="ts">
import { inputRootClassName } from '@fex/components-styles/input'
import { cn } from '@fex/utils'
import { computed, provide } from 'vue'
import { useInput } from './use-input'
import { inputContextKey } from './input-context'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ value?: string; defaultValue?: string; disabled?: boolean; readOnly?: boolean; invalid?: boolean; class?: string }>(), { defaultValue: '', disabled: false, readOnly: false, invalid: false })
const emit = defineEmits<{ valueChange: [value: string, meta: { reason: 'input' | 'clear'; event?: Event }]; clear: [meta: { reason: 'clear' }] }>()
const input = useInput({ value: () => props.value, defaultValue: () => props.defaultValue, disabled: () => props.disabled, readOnly: () => props.readOnly, invalid: () => props.invalid, onValueChange: (value, meta) => emit('valueChange', value, meta), onClear: (meta) => emit('clear', meta) })
provide(inputContextKey, input)
const className = computed(() => cn(inputRootClassName, props.class))
</script>
<template><div v-bind="$attrs" data-slot="input-root" :data-disabled="input.disabled.value || undefined" :data-readonly="input.readOnly.value || undefined" :data-invalid="input.invalid.value || undefined" :class="className"><slot /></div></template>
