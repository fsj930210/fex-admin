<script setup lang="ts">
import { inputControlClassName } from '@fex/components-styles/input'
import { cn } from '@fex/utils'
import { computed, inject, ref, useAttrs } from 'vue'
import { inputContextKey } from './input-context'

defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const emit = defineEmits<{ input: [event: Event] }>()
const input = inject(inputContextKey)
if (!input) throw new Error('InputControl must be used inside InputRoot.')
const element = ref<HTMLInputElement | null>(null)
const className = computed(() => cn(inputControlClassName, attrs.class as string | undefined))
function onInput(event: Event) { emit('input', event); if (!event.defaultPrevented) input.setValue((event.currentTarget as HTMLInputElement).value, 'input', event) }
function setElement(value: Element | null) { element.value = value as HTMLInputElement | null; input.setFocusElement(element.value) }
defineExpose({ focus: () => element.value?.focus(), blur: () => element.value?.blur() })
</script>
<template><input v-bind="attrs" :ref="setElement" :value="input.value.value" :disabled="input.disabled.value" :readonly="input.readOnly.value" :aria-invalid="input.invalid.value || undefined" data-slot="input-control" :class="className" @input="onInput"></template>
