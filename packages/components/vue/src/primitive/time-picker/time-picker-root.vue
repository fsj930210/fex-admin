<script setup lang="ts">
import type { DisabledTime, TimePickerChangeDetails, TimeValue } from '@fex/components-core/time-picker/types'
import { computed, provide, toRef, useAttrs } from 'vue'
import PopoverRoot from '../popover/popover-root.vue'
import { timePickerContextKey } from './context'
import { useTimePicker } from './use-time-picker'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  value?: TimeValue | null | undefined
  defaultValue?: TimeValue | null
  format?: string
  use12Hours?: boolean
  disabled?: boolean
  readOnly?: boolean
  disabledTime?: DisabledTime | undefined
}>(), { use12Hours: false, disabled: false, readOnly: false })
const emit = defineEmits<{ change: [value: TimeValue | null, details: TimePickerChangeDetails] }>()
const attrs = useAttrs()
const { controller, snapshot } = useTimePicker({
  value: props.value,
  defaultValue: props.defaultValue,
  onChange: (value, details) => emit('change', value, details),
}, toRef(props, 'value'))
provide(timePickerContextKey, {
  controller,
  snapshot,
  use12Hours: computed(() => props.use12Hours),
  disabled: computed(() => props.disabled),
  readOnly: computed(() => props.readOnly),
  disabledTime: computed(() => props.disabledTime),
  format: computed(() => props.format ?? (props.use12Hours ? 'hh:mm:ss A' : 'HH:mm:ss')),
})
</script>

<template>
  <PopoverRoot v-bind="attrs" :trigger="['focus', 'click']">
    <slot :controller="controller" :snapshot="snapshot" />
  </PopoverRoot>
</template>
