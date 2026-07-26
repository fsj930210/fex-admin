<script setup lang="ts">
import { getCalendarToday, getCalendarValueDate, type CalendarCell, type CalendarDate, type CalendarPanel, type CalendarRange, type CalendarValue, type CalendarWeekday } from '@fex/components-core/calendar'
import { createDatePickerDisabledDate } from '@fex/components-core/date-picker/constraints'
import { getDefaultPanelByPicker, getGranularityByPicker, getRangePanelViewDates } from '@fex/components-core/date-picker/panel'
import { createNextRangeValue, getRangeFromValue } from '@fex/components-core/date-picker/range'
import { formatDatePickerValue, normalizeDatePickerValue, parseDatePickerValue } from '@fex/components-core/date-picker/value'
import type { DatePickerInputPart, DatePickerPicker } from '@fex/components-core/date-picker/types'
import { datePickerCellClassName, datePickerContentClassName, datePickerFooterClassName, datePickerGridClassName, datePickerHeaderClassName, datePickerHeaderLabelClassName, datePickerHeaderNavigationClassName, datePickerPanelClassName, datePickerPanelsClassName, datePickerRangeInputClassName, datePickerTriggerClassName, datePickerWeekHeaderClassName } from '@fex/components-styles/date-picker'
import { cn } from '@fex/utils'
import { computed, ref, useAttrs, useSlots, watch } from 'vue'
import { CalendarIcon } from '../../icon/calendar'
import { ChevronLeftIcon, ChevronRightIcon } from '../../icon/chevron'
import { CalendarCell as PrimitiveCalendarCell, CalendarGrid, CalendarHeader, CalendarRoot, CalendarWeekHeader } from '../calendar/calendar'
import Button from '../../ui/button/button.vue'
import { InputClear, InputControl, InputPrefix, InputRoot, InputSuffix } from '../input/input'
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from '../popover/popover'

const props = withDefaults(defineProps<{
  value?: CalendarRange<CalendarValue>
  defaultValue?: CalendarRange<CalendarValue>
  open?: boolean
  defaultOpen?: boolean
  picker?: DatePickerPicker
  needConfirm?: boolean
  disabled?: boolean
  readOnly?: boolean
  allowClear?: boolean
  allowEmpty?: boolean | { start?: boolean; end?: boolean }
  order?: boolean
  panelCount?: 1 | 2
  placeholder?: readonly [string, string]
  format?: string
  weekStartsOn?: CalendarWeekday
  minDate?: CalendarDate
  maxDate?: CalendarDate
  disabledDate?: (date: CalendarDate, activePart: DatePickerInputPart) => boolean
}>(), { open: undefined, defaultOpen: false, picker: 'date', disabled: false, readOnly: false, allowClear: true, order: true, panelCount: 2, weekStartsOn: 0 })

const emit = defineEmits<{ change: [value: CalendarRange<CalendarValue>]; openChange: [open: boolean] }>()
const slots = useSlots()
const attrs = useAttrs()
const localValue = ref<CalendarRange<CalendarValue>>(props.defaultValue ?? {})
const localOpen = ref(props.defaultOpen)
const pendingValue = ref<CalendarRange<CalendarValue>>(localValue.value)
const activePart = ref<DatePickerInputPart>('start')
const panel = ref<CalendarPanel>(getDefaultPanelByPicker(props.picker))
const viewDate = ref(getCalendarToday())
const currentValue = computed(() => props.value === undefined ? localValue.value : props.value)
const currentOpen = computed(() => props.open === undefined ? localOpen.value : props.open)
const activeValue = computed(() => props.needConfirm ? pendingValue.value : currentValue.value)
const viewDates = computed(() => getRangePanelViewDates(viewDate.value, panel.value))
const allowEmpty = computed(() => props.allowEmpty === true ? { start: true, end: true } : typeof props.allowEmpty === 'object' ? { start: Boolean(props.allowEmpty.start), end: Boolean(props.allowEmpty.end) } : { start: false, end: false })
const displayValue = computed(() => [
  formatDatePickerValue(currentValue.value.start ?? null, { picker: props.picker, format: props.format, weekStartsOn: props.weekStartsOn }),
  formatDatePickerValue(currentValue.value.end ?? null, { picker: props.picker, format: props.format, weekStartsOn: props.weekStartsOn }),
] as const)
const startText = ref(displayValue.value[0])
const endText = ref(displayValue.value[1])
const focusedPart = ref<DatePickerInputPart | null>(null)
watch(displayValue, (next) => { startText.value = next[0]; endText.value = next[1] })

function setOpen(next: boolean) { if (props.open === undefined) localOpen.value = next; if (next) pendingValue.value = currentValue.value; if (!next) { panel.value = getDefaultPanelByPicker(props.picker); focusedPart.value = null }; emit('openChange', next) }
function close() { setOpen(false) }
function commit(next: CalendarRange<CalendarValue>) { if (props.value === undefined) localValue.value = next; emit('change', next) }
function confirm() { commit(pendingValue.value); close() }
function cancel() { pendingValue.value = currentValue.value; close() }
function clear() {
  const next: CalendarRange<CalendarValue> = {}
  if (!allowEmpty.value.start && activeValue.value.start) next.start = activeValue.value.start
  if (!allowEmpty.value.end && activeValue.value.end) next.end = activeValue.value.end
  pendingValue.value = next
  commit(next)
}
function disabledDate(date: CalendarDate) {
  return createDatePickerDisabledDate({ picker: props.picker, panel: panel.value, minDate: props.minDate, maxDate: props.maxDate, disabledDate: (value) => Boolean(props.disabledDate?.(value, activePart.value)) })(date, { activePart: activePart.value, from: getRangeFromValue(activeValue.value, activePart.value), rangeValue: activeValue.value })
}
function select(cell: CalendarCell) {
  const date = getCalendarValueDate(cell.value)
  viewDate.value = date
  if (cell.panel === 'year' && props.picker !== 'year') { panel.value = props.picker === 'month' || props.picker === 'quarter' ? getDefaultPanelByPicker(props.picker) : 'month'; return }
  if (cell.panel === 'month' && props.picker !== 'month') { panel.value = 'date'; return }
  const next = createNextRangeValue(activeValue.value, normalizeDatePickerValue(date, props.picker, props.weekStartsOn), activePart.value, props.order)
  if (props.needConfirm) pendingValue.value = next
  else commit(next)
  if (activePart.value === 'start') {
    activePart.value = 'end'
    focusedPart.value = 'end'
  }
  else if (next.start && next.end && !props.needConfirm) close()
}

function input(part: DatePickerInputPart, text: string) {
  if (part === 'start') startText.value = text
  else endText.value = text
  activePart.value = part
  const parsed = parseDatePickerValue(text, { picker: props.picker, format: props.format, weekStartsOn: props.weekStartsOn })
  if (parsed.valid) {
    const next = createNextRangeValue(activeValue.value, parsed.value, part, props.order)
    if (props.needConfirm) pendingValue.value = next
    else commit(next)
  }
}

function focusPart(part: DatePickerInputPart) {
  activePart.value = part
  focusedPart.value = part
}

function triggerBindings(triggerProps: Record<string, unknown>) {
  if (!props.disabled) return triggerProps
  const { onClick: _onClick, onFocus: _onFocus, onPointerenter: _onPointerenter, onPointerleave: _onPointerleave, onContextmenu: _onContextmenu, ...rest } = triggerProps
  return { ...rest, 'aria-disabled': true, tabindex: -1 }
}
</script>

<template>
  <PopoverRoot :open="currentOpen" :trigger="disabled ? [] : ['focus', 'click']" @open-change="setOpen">
    <PopoverTrigger v-slot="{ props: triggerProps, ref: triggerRef }">
      <div :type="triggerProps.type" :aria-haspopup="triggerProps['aria-haspopup']" :aria-expanded="triggerProps['aria-expanded']" :data-state="triggerProps['data-state']" :ref="triggerRef" :class="cn(datePickerTriggerClassName, disabled && 'cursor-not-allowed', attrs.class as string | undefined)" @pointerdown="!disabled && setOpen(true)" @click="!disabled && triggerProps.onClick($event)" @focusin="!disabled && triggerProps.onFocus($event)" @focusout="triggerProps.onBlur($event)">
      <InputRoot :value="`${displayValue[0]}${displayValue[1]}`" :disabled="disabled" :read-only="readOnly" class="cursor-pointer gap-0" @clear="clear">
        <InputPrefix v-if="slots.prefix"><slot name="prefix" /></InputPrefix>
        <InputRoot data-range-part="start" :data-active="focusedPart === 'start' || undefined" :value="startText" :read-only="readOnly" :class="datePickerRangeInputClassName" @value-change="input('start', $event)">
          <InputControl class="min-w-0 px-2 text-center" :placeholder="placeholder?.[0] ?? '开始日期'" @focus="focusPart('start')" @click.stop="!disabled && (setOpen(true), focusPart('start'))" />
        </InputRoot>
        <span aria-hidden="true" class="inline-flex shrink-0 items-center justify-center px-1 text-muted-foreground">→</span>
        <InputRoot data-range-part="end" :data-active="focusedPart === 'end' || undefined" :value="endText" :read-only="readOnly" :class="datePickerRangeInputClassName" @value-change="input('end', $event)">
          <InputControl class="min-w-0 px-2 text-center" :placeholder="placeholder?.[1] ?? '结束日期'" @focus="focusPart('end')" @click.stop="!disabled && (setOpen(true), focusPart('end'))" />
        </InputRoot>
        <InputClear v-if="allowClear" />
        <InputSuffix v-if="!allowClear || !(displayValue[0] || displayValue[1])"><slot name="suffix"><CalendarIcon /></slot></InputSuffix>
      </InputRoot>
      </div>
    </PopoverTrigger>
    <PopoverPortal>
    <PopoverContent :class="datePickerContentClassName" data-slot="range-picker-content">
      <slot name="panel" :close="close" :clear="clear" :confirm="confirm" :cancel="cancel" :value="activeValue" :active-part="activePart">
        <div :class="datePickerPanelsClassName" data-slot="range-picker-panels">
          <CalendarRoot v-for="(panelDate, index) in (panelCount === 1 || (picker !== 'date' && picker !== 'week') ? [viewDates[0]] : viewDates)" :key="`${panelDate.year}-${panelDate.month}-${index}`" :class="datePickerPanelClassName" :range="activeValue" :view-date="panelDate" :panel="panel" :granularity="getGranularityByPicker(picker)" :week-starts-on="weekStartsOn" :disabled-date="disabledDate" @cell-select="select" @panel-change="panel = $event">
            <CalendarHeader v-slot="header">
              <div :class="datePickerHeaderClassName" data-slot="date-picker-header">
                <div class="flex items-center gap-1"><Button variant="ghost" size="icon-sm" :class="datePickerHeaderNavigationClassName" @click="header.panel === 'date' ? header.previousYear() : header.previous()"><ChevronLeftIcon class="size-4" /><ChevronLeftIcon class="-ml-2 size-4" /></Button><Button v-if="header.panel === 'date'" variant="ghost" size="icon-sm" :class="datePickerHeaderNavigationClassName" @click="header.previousMonth"><ChevronLeftIcon class="size-4" /></Button></div>
                <div class="flex items-center gap-2 text-base font-semibold"><Button variant="ghost" size="sm" :class="datePickerHeaderLabelClassName" @click="header.setPanel('year')">{{ header.panel === 'decade' ? `${Math.floor(header.viewDate.year / 10) * 10}-${Math.floor(header.viewDate.year / 10) * 10 + 9}年` : `${header.viewDate.year}年` }}</Button><Button v-if="picker !== 'year' && header.panel === 'date'" variant="ghost" size="sm" :class="datePickerHeaderLabelClassName" @click="header.setPanel('month')">{{ header.viewDate.month }}月</Button></div>
                <div class="flex items-center gap-1"><Button v-if="header.panel === 'date'" variant="ghost" size="icon-sm" :class="datePickerHeaderNavigationClassName" @click="header.nextMonth"><ChevronRightIcon class="size-4" /></Button><Button variant="ghost" size="icon-sm" :class="datePickerHeaderNavigationClassName" @click="header.panel === 'date' ? header.nextYear() : header.next()"><ChevronRightIcon class="size-4" /><ChevronRightIcon class="-ml-2 size-4" /></Button></div>
              </div>
            </CalendarHeader>
            <CalendarWeekHeader v-if="panel === 'date'" :class="datePickerWeekHeaderClassName" />
            <CalendarGrid :class="datePickerGridClassName" :data-panel="panel"><template #default="{ cell }"><PrimitiveCalendarCell :cell="cell" :class="datePickerCellClassName" /></template></CalendarGrid>
          </CalendarRoot>
        </div>
      </slot>
      <slot name="footer" :close="close" :clear="clear" :confirm="confirm" :cancel="cancel" :value="activeValue"><div v-if="needConfirm" :class="datePickerFooterClassName" data-slot="date-picker-footer"><Button variant="outline" @click="cancel">取消</Button><Button @click="confirm">确认</Button></div></slot>
    </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
