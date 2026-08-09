<script setup lang="ts">
import type { InputNumberFormatter, InputNumberParser } from '@fex-design/core/input-number/types'
import {
  defaultInputNumberFormatter,
  defaultInputNumberParser,
  isInputNumberOutOfRange,
  normalizeInputNumber,
  stepInputNumber,
} from '@fex-design/core/input-number/value'
import {
  inputNumberActionsClassName,
  inputNumberDecrementClassName,
  inputNumberIncrementClassName,
} from '@fex-design/styles/input-number'
import { computed, getCurrentInstance, ref, useAttrs, watch } from 'vue'
import MinusIcon from '../../icon/minus-icon.vue'
import PlusIcon from '../../icon/plus-icon.vue'
import { InputClear, InputControl, InputPrefix, InputRoot, InputSuffix } from '../input/input'

defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    value?: number
    defaultValue?: number
    min?: number
    max?: number
    step?: number
    precision?: number
    parser?: InputNumberParser
    formatter?: InputNumberFormatter
    disabled?: boolean
    readOnly?: boolean
    invalid?: boolean
    status?: 'error' | 'warning'
    clearable?: boolean
    class?: string
  }>(),
  {
    step: 1,
    clearable: false,
  },
)
const emit = defineEmits<{
  change: [event: Event, value: number | undefined]
}>()
const slots = defineSlots<{ prefix?: () => unknown; suffix?: () => unknown }>()
const attrs = useAttrs()
const parser = computed(() => props.parser ?? defaultInputNumberParser)
const formatter = computed(() => props.formatter ?? defaultInputNumberFormatter)
const controlled = Object.prototype.hasOwnProperty.call(
  getCurrentInstance()?.vnode.props ?? {},
  'value',
)
const internalValue = ref(props.defaultValue)
const currentValue = computed(() => (controlled ? props.value : internalValue.value))
const constraints = computed(() => ({
  min: props.min,
  max: props.max,
  step: props.step,
  precision: props.precision,
}))
const draft = ref(formatter.value(currentValue.value, { userTyping: false, input: '' }))
const userTyping = ref(false)

// Controlled values synchronize the editable buffer only outside an active typing session.
watch(
  () => props.value,
  (value) => {
    if (!userTyping.value)
      draft.value = formatter.value(value, { userTyping: false, input: draft.value })
  },
)

const outOfRange = computed(() => isInputNumberOutOfRange(currentValue.value, constraints.value))
const canIncrement = computed(
  () =>
    !props.disabled &&
    !props.readOnly &&
    (props.max === undefined || currentValue.value === undefined || currentValue.value < props.max),
)
const canDecrement = computed(
  () =>
    !props.disabled &&
    !props.readOnly &&
    (props.min === undefined || currentValue.value === undefined || currentValue.value > props.min),
)

function setValue(value: number | undefined) {
  if (!controlled) internalValue.value = value
}
function input(text: string, event?: Event) {
  userTyping.value = true
  draft.value = text
  const value = parser.value(text)
  if (text.trim() === '' || value !== undefined) {
    setValue(value)
    if (event) emit('change', event, value)
  }
}
function commit(value: number | undefined) {
  const next = value === undefined ? undefined : normalizeInputNumber(value, constraints.value)
  setValue(next)
  userTyping.value = false
  draft.value = formatter.value(next, { userTyping: false, input: draft.value })
  return next
}
function stepBy(event: Event, direction: 'increment' | 'decrement') {
  const next = commit(
    stepInputNumber(parser.value(draft.value) ?? currentValue.value, direction, constraints.value),
  )
  emit('change', event, next)
}
function keydown(event: KeyboardEvent) {
  if (event.defaultPrevented || props.disabled || props.readOnly) return
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault()
    stepBy(event, event.key === 'ArrowUp' ? 'increment' : 'decrement')
  }
}
function blur(event: FocusEvent) {
  const before = currentValue.value
  const next = commit(parser.value(draft.value) ?? before)
  if (next !== before) emit('change', event, next)
}
function clear(event: MouseEvent) {
  commit(undefined)
  emit('change', event, undefined)
}
</script>

<template>
  <InputRoot
    :value="draft"
    :disabled="props.disabled"
    :read-only="props.readOnly"
    :invalid="props.invalid"
    :status="props.status"
    :class="props.class"
    :data-out-of-range="outOfRange || undefined"
    @value-change="(text, meta) => input(text, meta?.event)"
  >
    <InputPrefix v-if="slots.prefix"><slot name="prefix" /></InputPrefix>
    <InputControl
      v-bind="attrs"
      type="text"
      role="spinbutton"
      :aria-valuemin="props.min"
      :aria-valuemax="props.max"
      :aria-valuenow="currentValue"
      @blur="blur"
      @keydown="keydown"
    />
    <InputClear v-if="props.clearable" aria-label="Clear input" @click="clear" />
    <InputSuffix v-if="slots.suffix"><slot name="suffix" /></InputSuffix>
    <InputSuffix v-else :class="inputNumberActionsClassName">
      <button
        type="button"
        aria-label="Increase value"
        data-action="increment"
        :disabled="!canIncrement"
        :class="inputNumberIncrementClassName"
        @pointerdown.prevent
        @click="stepBy($event, 'increment')"
      >
        <PlusIcon />
      </button>
      <button
        type="button"
        aria-label="Decrease value"
        data-action="decrement"
        :disabled="!canDecrement"
        :class="inputNumberDecrementClassName"
        @pointerdown.prevent
        @click="stepBy($event, 'decrement')"
      >
        <MinusIcon />
      </button>
    </InputSuffix>
  </InputRoot>
</template>
