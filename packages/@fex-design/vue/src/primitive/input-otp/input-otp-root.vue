<script setup lang="ts">
import { createInputOTPController } from '@fex-design/core/input-otp/create-input-otp-controller'
import type {
  InputOTPChangeMeta,
  InputOTPCompleteMeta,
  InputOTPSegmentSnapshot,
  InputOTPValue,
} from '@fex-design/core/input-otp/types'
import { inputOTPRootClassName } from '@fex-design/styles/input-otp'
import { cn } from '@fex/utils'
import { provide, useAttrs, watchEffect } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import { inputOTPContextKey } from './context'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  value?: InputOTPValue
  defaultValue?: InputOTPValue
  disabled?: boolean
  readOnly?: boolean
  invalid?: boolean
  isComplete?: (value: InputOTPValue, segments: readonly InputOTPSegmentSnapshot[]) => boolean
}>(), {
  disabled: false,
  readOnly: false,
  invalid: false,
})
const emit = defineEmits<{
  change: [value: InputOTPValue, meta: InputOTPChangeMeta]
  complete: [value: InputOTPValue, meta: InputOTPCompleteMeta]
}>()
const attrs = useAttrs()
const controller = createInputOTPController({
  get value() {
    return props.value
  },
  get defaultValue() {
    return props.defaultValue
  },
  get disabled() {
    return props.disabled
  },
  get readOnly() {
    return props.readOnly
  },
  get invalid() {
    return props.invalid
  },
  get isComplete() {
    return props.isComplete
  },
  onChange: (value, meta) => emit('change', value, meta),
  onComplete: (value, meta) => emit('complete', value, meta),
})
const snapshot = useCoreStore(controller)
// Controlled props are an external reactive boundary for the framework-neutral controller.
watchEffect(() => {
  controller.setOptions({
    value: props.value,
    defaultValue: props.defaultValue,
    disabled: props.disabled,
    readOnly: props.readOnly,
    invalid: props.invalid,
    isComplete: props.isComplete,
    onChange: (value, meta) => emit('change', value, meta),
    onComplete: (value, meta) => emit('complete', value, meta),
  })
})
const inputs = new Map<number, HTMLInputElement>()

function registerInput(index: number, element: HTMLInputElement | null) {
  if (element) inputs.set(index, element)
  else inputs.delete(index)
}

function focusInput(index: number, cursor: 'start' | 'end' | 'all' = 'all') {
  const input = inputs.get(index)
  if (!input || input.disabled) return
  input.focus()
  const position = cursor === 'start' ? 0 : input.value.length
  input.setSelectionRange(cursor === 'all' ? 0 : position, position)
}

provide(inputOTPContextKey, {
  controller,
  snapshot: () => snapshot.value,
  registerInput,
  focusInput,
})
</script>

<template>
  <div
    v-bind="attrs"
    role="group"
    data-slot="input-otp-root"
    :data-disabled="props.disabled ? 'true' : undefined"
    :data-readonly="props.readOnly ? 'true' : undefined"
    :data-invalid="props.invalid ? 'true' : undefined"
    :data-complete="snapshot.complete ? 'true' : undefined"
    :class="cn(inputOTPRootClassName, attrs.class as string | undefined)"
  >
    <slot />
  </div>
</template>
