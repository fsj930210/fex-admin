<script lang="ts">
  import type { CalendarDate, CalendarRange, CalendarValue, CalendarWeekday } from '@fex-design/core/calendar'
  import type { DatePickerPicker, DatePickerSelectionValue } from '@fex-design/svelte/primitive/date-picker'
  import {
    DatePickerCancel,
    DatePickerConfirm,
    DatePickerContent,
    DatePickerFooter,
    DatePickerPanel,
    DatePickerRoot,
    DatePickerToday,
    DatePickerTrigger,
    RangePickerContent,
    RangePickerPanelGroup,
    RangePickerRoot,
    RangePickerTrigger,
  } from '@fex-design/svelte/primitive/date-picker'

  interface Props {
    value?: DatePickerSelectionValue | CalendarRange<CalendarValue>
    defaultValue?: DatePickerSelectionValue | CalendarRange<CalendarValue>
    open?: boolean
    defaultOpen?: boolean
    picker?: DatePickerPicker
    status?: 'error' | 'warning'
    multiple?: boolean
    needConfirm?: boolean
    disabled?: boolean
    readOnly?: boolean
    allowClear?: boolean
    allowEmpty?: boolean | { start?: boolean; end?: boolean }
    order?: boolean
    format?: string
    placeholder?: string
    weekStartsOn?: CalendarWeekday
    minDate?: CalendarDate
    maxDate?: CalendarDate
    disabledDate?: (date: CalendarDate, activePart: 'start' | 'end') => boolean
    range?: boolean
    onChange?: (value: unknown) => void
    onOpenChange?: (open: boolean) => void
  }

  let props: Props = $props()
  const dateValue = () => props.value as DatePickerSelectionValue | undefined
  const dateDefaultValue = () => props.defaultValue as DatePickerSelectionValue | undefined
  const dateDisabledDate = () => props.disabledDate as ((date: CalendarDate) => boolean) | undefined
  const rangeValue = () => props.value as CalendarRange<CalendarValue> | undefined
  const rangeDefaultValue = () => props.defaultValue as CalendarRange<CalendarValue> | undefined
  const rangeDisabledDate = () => props.disabledDate as ((date: CalendarDate, activePart: 'start' | 'end') => boolean) | undefined
  const rangePlaceholder = $derived.by(() => {
    if (props.picker === 'week') return { start: '开始周', end: '结束周' }
    if (props.picker === 'month') return { start: '开始月份', end: '结束月份' }
    if (props.picker === 'quarter') return { start: '开始季度', end: '结束季度' }
    if (props.picker === 'year') return { start: '开始年份', end: '结束年份' }
    return { start: '开始日期', end: '结束日期' }
  })
</script>

{#if props.range}
  <RangePickerRoot
    value={rangeValue()}
    defaultValue={rangeDefaultValue()}
    open={props.open}
    defaultOpen={props.defaultOpen}
    picker={props.picker}
    status={props.status}
    needConfirm={props.needConfirm}
    disabled={props.disabled}
    readOnly={props.readOnly}
    allowClear={props.allowClear}
    allowEmpty={props.allowEmpty}
    order={props.order}
    format={props.format}
    weekStartsOn={props.weekStartsOn}
    minDate={props.minDate}
    maxDate={props.maxDate}
    disabledDate={rangeDisabledDate()}
    onChange={props.onChange}
    onOpenChange={props.onOpenChange}
  >
    <RangePickerTrigger class="w-80" startPlaceholder={rangePlaceholder.start} endPlaceholder={rangePlaceholder.end} />
    <RangePickerContent class="overflow-hidden p-0">
      <RangePickerPanelGroup />
      {#if props.needConfirm}
        <DatePickerFooter>
          <DatePickerCancel>取消</DatePickerCancel>
          <DatePickerConfirm>确定</DatePickerConfirm>
        </DatePickerFooter>
      {/if}
    </RangePickerContent>
  </RangePickerRoot>
{:else}
  <DatePickerRoot
    value={dateValue()}
    defaultValue={dateDefaultValue()}
    open={props.open}
    defaultOpen={props.defaultOpen}
    picker={props.picker}
    status={props.status}
    multiple={props.multiple}
    needConfirm={props.needConfirm}
    disabled={props.disabled}
    readOnly={props.readOnly}
    allowClear={props.allowClear}
    format={props.format}
    weekStartsOn={props.weekStartsOn}
    minDate={props.minDate}
    maxDate={props.maxDate}
    disabledDate={dateDisabledDate()}
    onChange={props.onChange}
    onOpenChange={props.onOpenChange}
  >
    <DatePickerTrigger class="w-56" placeholder={props.placeholder} />
    <DatePickerContent class="overflow-hidden p-0">
      <DatePickerPanel />
      {#if props.needConfirm || props.multiple}
        <DatePickerFooter>
          <DatePickerToday>今天</DatePickerToday>
          <DatePickerCancel>取消</DatePickerCancel>
          <DatePickerConfirm>确定</DatePickerConfirm>
        </DatePickerFooter>
      {/if}
    </DatePickerContent>
  </DatePickerRoot>
{/if}
