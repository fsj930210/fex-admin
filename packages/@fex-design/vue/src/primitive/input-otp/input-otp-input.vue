<script setup lang="ts">
import type { InputOTPAccept, InputOTPTransform } from '@fex-design/core/input-otp/types'
import { inputOTPInputClassName } from '@fex-design/styles/input-otp'
import { cn } from '@fex/utils'
import { computed, onMounted, onScopeDispose, ref, useAttrs, watch } from 'vue'
import { useInputOTPContext } from './context'

defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    index: number
    maxLength?: number
    autoAdvance?: boolean
    transform?: InputOTPTransform
    accept?: InputOTPAccept
    disabled?: boolean
    readOnly?: boolean
  }>(),
  { autoAdvance: true, disabled: false, readOnly: false },
)
const attrs = useAttrs()
const context = useInputOTPContext('InputOTPInput')
const element = ref<HTMLInputElement | null>(null)
const currentValue = computed(() => context.snapshot().value[props.index] ?? '')
const segment = computed(() =>
  context.snapshot().segments.find((item) => item.index === props.index),
)
const currentDisabled = computed(() => context.snapshot().disabled || props.disabled)
const currentReadOnly = computed(() => context.snapshot().readOnly || props.readOnly)
const config = () => ({
  index: props.index,
  maxLength: props.maxLength,
  autoAdvance: props.autoAdvance,
  transform: props.transform,
  accept: props.accept,
  disabled: props.disabled,
  readOnly: props.readOnly,
})

let unregister: (() => void) | undefined
onMounted(() => {
  unregister = context.controller.registerSegment(config())
  context.registerInput(props.index, element.value)
})
onScopeDispose(() => {
  unregister?.()
  context.registerInput(props.index, null)
})
// Registration options are an external controller boundary, so prop changes must refresh it.
watch(config, (nextConfig) => context.controller.updateSegment(nextConfig))

function applyText(
  text: string,
  reason: 'input' | 'paste' | 'delete' | 'composition',
  selection = { start: 0, end: currentValue.value.length },
) {
  const result = context.controller.applyInput({ index: props.index, text, selection, reason })
  if (result.focusIndex !== undefined) context.focusInput(result.focusIndex, result.cursor)
  return result
}

function handleInput(event: Event) {
  const input = event.currentTarget as HTMLInputElement
  const inputEvent = event as InputEvent
  const result = applyText(input.value, inputEvent.inputType?.startsWith('delete') ? 'delete' : 'input')
  if (!result.accepted) input.value = currentValue.value
}

function handlePaste(event: ClipboardEvent) {
  if (currentDisabled.value || currentReadOnly.value) return
  event.preventDefault()
  const input = event.currentTarget as HTMLInputElement
  applyText(event.clipboardData?.getData('text') ?? '', 'paste', {
    start: input.selectionStart ?? 0,
    end: input.selectionEnd ?? 0,
  })
}

function handleKeydown(event: KeyboardEvent) {
  const input = event.currentTarget as HTMLInputElement
  const start = input.selectionStart ?? 0
  const end = input.selectionEnd ?? start
  if (event.key === 'Backspace' && currentValue.value === '' && start === 0 && end === 0) {
    event.preventDefault()
    context.focusInput(props.index - 1, 'end')
  } else if (event.key === 'ArrowLeft' && start === 0 && end === 0) {
    event.preventDefault()
    context.focusInput(props.index - 1, 'end')
  } else if (event.key === 'ArrowRight' && start === currentValue.value.length && end === start) {
    event.preventDefault()
    context.focusInput(props.index + 1, 'start')
  }
}
</script>

<template>
  <input
    v-bind="attrs"
    ref="element"
    type="text"
    :value="currentValue"
    :disabled="currentDisabled"
    :readonly="currentReadOnly"
    :aria-invalid="context.snapshot().invalid || undefined"
    data-slot="input-otp-input"
    :data-index="props.index"
    :data-filled="currentValue.length > 0 ? 'true' : undefined"
    :data-complete="segment?.complete ? 'true' : undefined"
    :class="cn(inputOTPInputClassName, attrs.class as string | undefined)"
    @input="handleInput"
    @paste="handlePaste"
    @keydown="handleKeydown"
  />
</template>
