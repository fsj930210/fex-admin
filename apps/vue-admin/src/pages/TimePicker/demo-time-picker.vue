<script setup lang="ts">
import { analyzeTimeFormat } from '@fex/components-core/date/utils'
import { TimePickerContent, TimePickerHourColumn, TimePickerMinuteColumn, TimePickerPanel, TimePickerPeriodColumn, TimePickerRoot, TimePickerSecondColumn, TimePickerTrigger, type DisabledTime, type TimeValue } from '@fex/components-vue/primitive/time-picker'
import Button from '@fex/components-vue/ui/button'
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{ value?: TimeValue | null; defaultValue?: TimeValue | null; use12Hours?: boolean; format?: string; step?: { hour?: number; minute?: number; second?: number }; disabledTime?: DisabledTime; disabled?: boolean; invalid?: boolean }>(), { defaultValue: null, use12Hours: false, disabled: false, invalid: false })
const emit = defineEmits<{ change: [value: TimeValue | null] }>()
const open = ref(false)
const resolvedFormat = computed(() => props.format ?? (props.use12Hours ? 'hh:mm:ss A' : 'HH:mm:ss'))
const columns = computed(() => analyzeTimeFormat(resolvedFormat.value, props.use12Hours).columns)
</script>

<template>
  <TimePickerRoot :value="value" :default-value="defaultValue" :format="resolvedFormat" :use12-hours="use12Hours" :disabled="disabled" :disabled-time="disabledTime" :open="open" placement="bottomLeft" @change="emit('change', $event)" @open-change="open = $event">
    <TimePickerTrigger class="w-56" :invalid="invalid"><template v-if="$slots.prefix" #prefix><slot name="prefix" /></template><template v-if="$slots.suffix" #suffix><slot name="suffix" /></template></TimePickerTrigger>
    <TimePickerContent>
      <TimePickerPanel><template v-for="column in columns" :key="column.unit"><TimePickerHourColumn v-if="column.unit === 'hour'" :step="step?.hour" /><TimePickerMinuteColumn v-else-if="column.unit === 'minute'" :step="step?.minute" /><TimePickerSecondColumn v-else-if="column.unit === 'second'" :step="step?.second" /><TimePickerPeriodColumn v-else /></template></TimePickerPanel>
      <div v-if="$slots.panelExtra" class="border-t border-border p-space-sm text-sm"><slot name="panelExtra" /></div>
      <div class="flex justify-end border-t border-border p-space-sm"><Button size="sm" variant="ghost" @click="open = false">确定</Button></div>
    </TimePickerContent>
  </TimePickerRoot>
</template>
