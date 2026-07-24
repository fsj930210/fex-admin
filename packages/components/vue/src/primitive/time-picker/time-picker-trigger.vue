<script setup lang="ts">
import { format as formatDate, parse } from '@fex/components-core/date/utils'
import { computed, inject, ref, watch } from 'vue'
import { ClockIcon } from '../../icon/clock'
import { InputClear, InputControl, InputPrefix, InputRoot, InputSuffix } from '../input/input'
import PopoverTrigger from '../popover/popover-trigger.vue'
import { timePickerContextKey } from './context'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ allowClear?: boolean; placeholder?: string; invalid?: boolean }>(), { allowClear: true, invalid: false })
const injectedContext = inject(timePickerContextKey)
if (!injectedContext) throw new Error('TimePickerTrigger must be used inside TimePickerRoot.')
const context = injectedContext as NonNullable<typeof injectedContext>
const formatted = computed(() => context.snapshot.value.value ? formatDate(context.snapshot.value.value, context.format.value) : '')
const text = ref(formatted.value)
// Raw input text may be temporarily invalid; synchronize only when the committed time changes.
watch(formatted, value => { text.value = value })
function input(value: string) { text.value = value; const result = parse(value, context.format.value); if (result.valid) context.controller.change(result.value, 'input', 'smooth') }
function clear() { text.value = ''; context.controller.clear() }
</script>
<template>
  <PopoverTrigger v-slot="trigger">
    <div v-bind="trigger.props" :ref="trigger.ref" class="inline-block">
    <InputRoot :value="text" :disabled="context.disabled.value" :read-only="context.readOnly.value" :invalid="invalid" @value-change="input" @clear="clear">
      <InputPrefix v-if="$slots.prefix"><slot name="prefix" /></InputPrefix>
      <InputControl aria-label="Time" :placeholder="placeholder ?? context.format.value" />
      <InputClear v-if="allowClear" />
      <InputSuffix v-if="!allowClear || !text"><slot name="suffix"><ClockIcon class="size-4" /></slot></InputSuffix>
    </InputRoot>
    </div>
  </PopoverTrigger>
</template>
