<script setup lang="ts">
import {
  getCalendarToday,
  getCalendarValueDate,
  type CalendarCell,
  type CalendarDate,
  type CalendarPanel,
  type CalendarValue,
  type CalendarWeekday,
} from '@fex/components-core/calendar'
import { createDatePickerDisabledDate } from '@fex/components-core/date-picker/constraints'
import { getDefaultPanelByPicker, getGranularityByPicker } from '@fex/components-core/date-picker/panel'
import { formatDatePickerValue, normalizeDatePickerValue, parseDatePickerValue } from '@fex/components-core/date-picker/value'
import type { DatePickerPicker } from '@fex/components-core/date-picker/types'
import { datePickerCellClassName, datePickerContentClassName, datePickerFooterClassName, datePickerGridClassName, datePickerHeaderClassName, datePickerHeaderLabelClassName, datePickerHeaderNavigationClassName, datePickerPanelClassName, datePickerTriggerClassName, datePickerWeekHeaderClassName } from '@fex/components-styles/date-picker'
import { cn } from '@fex/utils'
import { computed, ref, useAttrs, useSlots, watch } from 'vue'
import { CalendarIcon } from '../../icon/calendar'
import { ChevronLeftIcon, ChevronRightIcon } from '../../icon/chevron'
import { CloseIcon } from '../../icon/close'
import { CalendarCell as PrimitiveCalendarCell, CalendarGrid, CalendarHeader, CalendarRoot, CalendarWeekHeader } from '../calendar/calendar'
import Button from '../../ui/button/button.vue'
import { InputClear, InputControl, InputPrefix, InputRoot, InputSuffix } from '../input/input'
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from '../popover/popover'

const props = withDefaults(defineProps<{
  value?: CalendarValue | readonly CalendarValue[] | null
  defaultValue?: CalendarValue | readonly CalendarValue[] | null
  open?: boolean
  defaultOpen?: boolean
  picker?: DatePickerPicker
  multiple?: boolean
  needConfirm?: boolean
  disabled?: boolean
  readOnly?: boolean
  allowClear?: boolean
  placeholder?: string
  displayValue?: string
  format?: string
  weekStartsOn?: CalendarWeekday
  minDate?: CalendarDate
  maxDate?: CalendarDate
  disabledDate?: (date: CalendarDate) => boolean
}>(), {
  open: undefined,
  defaultOpen: false,
  needConfirm: undefined,
  picker: 'date',
  multiple: false,
  disabled: false,
  readOnly: false,
  allowClear: true,
  weekStartsOn: 0,
})

const emit = defineEmits<{
  change: [value: CalendarValue | readonly CalendarValue[] | null]
  openChange: [open: boolean]
}>()

const slots = useSlots()
const attrs = useAttrs()
const localValue = ref<CalendarValue | readonly CalendarValue[] | null>(props.defaultValue ?? (props.multiple ? [] : null))
const localOpen = ref(props.defaultOpen)
const pendingValue = ref<CalendarValue | readonly CalendarValue[] | null>(localValue.value)
const panel = ref<CalendarPanel>(getDefaultPanelByPicker(props.picker))
const viewDate = ref(getCalendarToday())
const currentValue = computed(() => props.value === undefined ? localValue.value : props.value)
const currentOpen = computed(() => props.open === undefined ? localOpen.value : props.open)
const needConfirm = computed(() => props.needConfirm ?? props.multiple)
const activeValue = computed(() => needConfirm.value ? pendingValue.value : currentValue.value)
function isValueArray(value: CalendarValue | readonly CalendarValue[] | null): value is readonly CalendarValue[] { return Array.isArray(value) }
const calendarSelectionProps = computed(() => isValueArray(activeValue.value)
  ? { value: null, values: activeValue.value }
  : { value: activeValue.value })
const displayValue = computed(() => isValueArray(currentValue.value)
  ? currentValue.value.map((item) => formatDatePickerValue(item, { picker: props.picker, format: props.format, weekStartsOn: props.weekStartsOn })).join(', ')
  : formatDatePickerValue(currentValue.value, { picker: props.picker, format: props.format, weekStartsOn: props.weekStartsOn }))
const text = ref(displayValue.value)

// 只同步受控 value 的展示文本；用户输入和选择都在对应事件里即时处理。
watch(displayValue, (next) => { text.value = next })

const disabledDate = computed(() => createDatePickerDisabledDate({
  picker: props.picker,
  panel: panel.value,
  ...(props.minDate ? { minDate: props.minDate } : {}),
  ...(props.maxDate ? { maxDate: props.maxDate } : {}),
  ...(props.disabledDate ? { disabledDate: props.disabledDate } : {}),
}))

function setOpen(next: boolean) {
  if (props.open === undefined) localOpen.value = next
  if (next) pendingValue.value = currentValue.value
  if (!next) panel.value = getDefaultPanelByPicker(props.picker)
  emit('openChange', next)
}

function commit(next: CalendarValue | readonly CalendarValue[] | null) {
  if (props.value === undefined) localValue.value = next
  emit('change', next)
}

function close() { setOpen(false) }
function clear() {
  const next = props.multiple ? [] : null
  pendingValue.value = next
  commit(next)
}
function confirm() { commit(pendingValue.value); close() }
function cancel() { pendingValue.value = currentValue.value; close() }

function select(value: CalendarValue) {
  if (props.multiple) {
    const values = Array.isArray(activeValue.value) ? activeValue.value : []
    const index = values.findIndex((item) => formatDatePickerValue(item, { picker: props.picker }) === formatDatePickerValue(value, { picker: props.picker }))
    const next = index >= 0 ? values.filter((_, currentIndex) => currentIndex !== index) : [...values, value]
    if (needConfirm.value) pendingValue.value = next
    else commit(next)
    return
  }
  if (needConfirm.value) pendingValue.value = value
  else { commit(value); close() }
}

function selectCell(cell: CalendarCell) {
  const date = getCalendarValueDate(cell.value)
  viewDate.value = date
  if (cell.panel === 'year' && props.picker !== 'year') { panel.value = props.picker === 'month' || props.picker === 'quarter' ? getDefaultPanelByPicker(props.picker) : 'month'; return }
  if (cell.panel === 'month' && props.picker !== 'month') { panel.value = 'date'; return }
  select(normalizeDatePickerValue(date, props.picker, props.weekStartsOn))
}

function input(next: string) {
  text.value = next
  if (props.multiple) return
  const parsed = parseDatePickerValue(next, { picker: props.picker, format: props.format, weekStartsOn: props.weekStartsOn })
  if (parsed.valid) select(parsed.value)
}

function removeValue(value: CalendarValue) {
  const values = Array.isArray(activeValue.value) ? activeValue.value : []
  const next = values.filter((item) => formatDatePickerValue(item, { picker: props.picker }) !== formatDatePickerValue(value, { picker: props.picker }))
  pendingValue.value = next
  commit(next)
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
      <div :type="triggerProps.type" :aria-haspopup="triggerProps['aria-haspopup']" :aria-expanded="triggerProps['aria-expanded']" :data-state="triggerProps['data-state']" :ref="triggerRef" :class="cn(datePickerTriggerClassName, disabled && 'cursor-not-allowed', attrs.class as string | undefined)" @click="!disabled && triggerProps.onClick($event)" @focusin="!disabled && triggerProps.onFocus($event)" @focusout="triggerProps.onBlur($event)">
      <InputRoot
        :value="multiple ? '' : props.displayValue ?? text"
        :disabled="disabled"
        :read-only="readOnly"
        @value-change="input"
        @clear="clear"
      >
        <InputPrefix v-if="slots.prefix"><slot name="prefix" /></InputPrefix>
        <div v-if="multiple && Array.isArray(currentValue) && currentValue.length" data-slot="date-picker-tags" class="flex min-w-0 flex-1 items-center gap-1 overflow-hidden px-2">
          <template v-for="(item, index) in currentValue.slice(0, 1)" :key="formatDatePickerValue(item, { picker, format, weekStartsOn })">
            <span data-slot="date-picker-tag" class="inline-flex shrink-0 items-center rounded bg-muted-background px-1.5 py-0.5 text-xs">{{ formatDatePickerValue(item, { picker, format, weekStartsOn }) }}<Button type="button" size="icon-xs" variant="ghost" class="ml-1" :aria-label="`移除 ${formatDatePickerValue(item, { picker, format, weekStartsOn })}`" @click.stop="removeValue(item)"><CloseIcon /></Button></span>
          </template>
          <span v-if="currentValue.length > 1" data-slot="date-picker-tag-overflow" :title="displayValue" class="inline-flex shrink-0 cursor-default items-center rounded bg-muted-background px-1.5 py-0.5 text-xs text-muted-foreground">+{{ currentValue.length - 1 }}</span>
        </div>
        <InputControl :class="multiple && Array.isArray(currentValue) && currentValue.length ? 'w-8 min-w-8 flex-none px-1' : undefined" :placeholder="multiple && Array.isArray(currentValue) && currentValue.length ? '' : placeholder ?? format ?? '请选择日期'" />
        <InputClear v-if="allowClear" />
        <InputSuffix v-if="!allowClear || !text"><slot name="suffix"><CalendarIcon /></slot></InputSuffix>
      </InputRoot>
      </div>
    </PopoverTrigger>
    <PopoverPortal>
    <PopoverContent :class="datePickerContentClassName" data-slot="date-picker-content">
      <slot name="panel" :close="close" :clear="clear" :confirm="confirm" :cancel="cancel" :value="activeValue">
        <div :class="slots.panelExtra ? 'flex' : undefined">
        <CalendarRoot
          :class="cn(datePickerPanelClassName, slots.panelExtra && 'min-w-0 flex-1')"
          v-bind="calendarSelectionProps"
          :view-date="viewDate"
          :panel="panel"
          :granularity="getGranularityByPicker(picker)"
          :week-starts-on="weekStartsOn"
          :disabled-date="disabledDate"
          @cell-select="selectCell"
          @view-date-change="viewDate = $event"
          @panel-change="panel = $event"
        >
          <CalendarHeader v-slot="header">
            <div data-slot="date-picker-header" :class="datePickerHeaderClassName">
              <div class="flex items-center gap-1"><Button variant="ghost" size="icon-sm" :class="datePickerHeaderNavigationClassName" @click="header.panel === 'date' ? header.previousYear() : header.previous()"><ChevronLeftIcon class="size-4" /><ChevronLeftIcon class="-ml-2 size-4" /></Button><Button v-if="header.panel === 'date'" variant="ghost" size="icon-sm" :class="datePickerHeaderNavigationClassName" @click="header.previousMonth"><ChevronLeftIcon class="size-4" /></Button></div>
              <div class="flex items-center gap-2 text-base font-semibold"><Button variant="ghost" size="sm" :class="datePickerHeaderLabelClassName" data-part="year" @click="header.setPanel('year')">{{ header.panel === 'decade' ? `${Math.floor(header.viewDate.year / 10) * 10}-${Math.floor(header.viewDate.year / 10) * 10 + 9}年` : `${header.viewDate.year}年` }}</Button><Button v-if="picker !== 'year' && header.panel === 'date'" variant="ghost" size="sm" :class="datePickerHeaderLabelClassName" data-part="month" @click="header.setPanel('month')">{{ header.viewDate.month }}月</Button></div>
              <div class="flex items-center gap-1"><Button v-if="header.panel === 'date'" variant="ghost" size="icon-sm" :class="datePickerHeaderNavigationClassName" @click="header.nextMonth"><ChevronRightIcon class="size-4" /></Button><Button variant="ghost" size="icon-sm" :class="datePickerHeaderNavigationClassName" @click="header.panel === 'date' ? header.nextYear() : header.next()"><ChevronRightIcon class="size-4" /><ChevronRightIcon class="-ml-2 size-4" /></Button></div>
            </div>
          </CalendarHeader>
          <CalendarWeekHeader v-if="panel === 'date'" :class="datePickerWeekHeaderClassName" />
          <CalendarGrid :class="datePickerGridClassName" :data-panel="panel">
            <template #default="{ cell }"><PrimitiveCalendarCell :cell="cell" :class="datePickerCellClassName" /></template>
          </CalendarGrid>
        </CalendarRoot>
        <div v-if="slots.panelExtra" class="flex w-40 shrink-0 flex-col border-l border-border">
          <div aria-hidden="true" class="h-12 shrink-0 border-b border-border" />
          <slot name="panel-extra" />
        </div>
        </div>
      </slot>
      <slot name="footer" :close="close" :clear="clear" :confirm="confirm" :cancel="cancel" :value="activeValue">
        <div v-if="needConfirm" data-slot="date-picker-footer" :class="datePickerFooterClassName">
          <Button variant="outline" @click="cancel">取消</Button>
          <Button @click="confirm">确认</Button>
        </div>
      </slot>
    </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
