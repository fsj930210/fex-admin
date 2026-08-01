<script setup lang="ts">
import { inputControlClassName } from '@fex/components-styles/input'
import { cn } from '@fex/utils'
import { computed, inject, ref, useAttrs, type ComponentPublicInstance } from 'vue'
import { inputContextKey } from './input-context'

defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const emit = defineEmits<{
  blur: [event: FocusEvent]
  click: [event: MouseEvent]
  focus: [event: FocusEvent]
  input: [event: Event]
}>()
const input = inject(inputContextKey)
if (!input) throw new Error('InputControl must be used inside InputRoot.')
const inputContext = input
const element = ref<HTMLInputElement | null>(null)
const className = computed(() => cn(inputControlClassName, attrs.class as string | undefined))
function onInput(event: Event) {
  emit('input', event)
  if (!event.defaultPrevented)
    inputContext.setValue((event.currentTarget as HTMLInputElement).value, 'input', event)
}
function setElement(value: Element | ComponentPublicInstance | null) {
  element.value = value as HTMLInputElement | null
  inputContext.setFocusElement(element.value)
}
defineExpose({ focus: () => element.value?.focus(), blur: () => element.value?.blur() })
</script>
<template>
  <input
    v-bind="attrs"
    :ref="setElement"
    :value="inputContext.value.value"
    :disabled="inputContext.disabled.value"
    :readonly="inputContext.readOnly.value"
    :aria-invalid="inputContext.invalid.value || undefined"
    data-slot="input-control"
    :class="className"
    @blur="emit('blur', $event)"
    @click="emit('click', $event)"
    @focus="emit('focus', $event)"
    @input="onInput"
  />
</template>
