import { getCalendarToday, getCalendarValueDate, type CalendarCell, type CalendarDate, type CalendarPanel, type CalendarRange, type CalendarValue, type CalendarWeekday } from '@fex/components-core/calendar'
import { createDatePickerDisabledDate } from '@fex/components-core/date-picker/constraints'
import { getDefaultPanelByPicker, getGranularityByPicker, getRangePanelViewDates } from '@fex/components-core/date-picker/panel'
import { createNextRangeValue, getRangeFromValue } from '@fex/components-core/date-picker/range'
import { formatDatePickerValue, normalizeDatePickerValue, parseDatePickerValue } from '@fex/components-core/date-picker/value'
import type { DatePickerInputPart, DatePickerPicker } from '@fex/components-core/date-picker/types'
import { datePickerCellClassName, datePickerContentClassName, datePickerFooterClassName, datePickerGridClassName, datePickerHeaderClassName, datePickerHeaderLabelClassName, datePickerHeaderNavigationClassName, datePickerPanelClassName, datePickerPanelsClassName, datePickerRangeInputClassName, datePickerWeekHeaderClassName } from '@fex/components-styles/date-picker'
import { createMemo, createSignal, For, Show, type JSX } from 'solid-js'
import { CalendarIcon } from '../../icon/calendar'
import { ChevronLeftIcon, ChevronRightIcon } from '../../icon/chevron'
import Button from '../../ui/button/button'
import { CalendarCell as PrimitiveCalendarCell, CalendarGrid, CalendarHeader, CalendarRoot, CalendarWeekHeader } from '../calendar/calendar'
import { InputClear, InputControl, InputPrefix, InputRoot, InputSuffix } from '../input/input'
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger } from '../popover/popover'

export interface RangePickerProps {
  class?: string
  value?: CalendarRange<CalendarValue>
  defaultValue?: CalendarRange<CalendarValue>
  open?: boolean
  defaultOpen?: boolean
  picker?: DatePickerPicker
  needConfirm?: boolean
  allowEmpty?: boolean | { start?: boolean; end?: boolean }
  allowClear?: boolean
  order?: boolean
  panelCount?: 1 | 2
  disabled?: boolean
  readOnly?: boolean
  prefix?: JSX.Element
  suffix?: JSX.Element
  minDate?: CalendarDate
  maxDate?: CalendarDate
  weekStartsOn?: CalendarWeekday
  disabledDate?: (date: CalendarDate, part: DatePickerInputPart) => boolean
  onChange?: (value: CalendarRange<CalendarValue>) => void
  onOpenChange?: (open: boolean) => void
}

export function RangePicker(props: RangePickerProps) {
  const picker = () => props.picker ?? 'date'
  const [localValue, setLocalValue] = createSignal<CalendarRange<CalendarValue>>(props.defaultValue ?? {})
  const [localOpen, setLocalOpen] = createSignal(props.defaultOpen ?? false)
  const [pending, setPending] = createSignal<CalendarRange<CalendarValue>>(localValue())
  const [activePart, setActivePart] = createSignal<DatePickerInputPart>('start')
  const [focusedPart, setFocusedPart] = createSignal<DatePickerInputPart | null>(null)
  const [panel, setPanel] = createSignal<CalendarPanel>(getDefaultPanelByPicker(picker()))
  const [viewDate, setViewDate] = createSignal(getCalendarToday())
  const value = () => props.value === undefined ? localValue() : props.value
  const activeValue = () => props.needConfirm ? pending() : value()
  const panelDates = createMemo(() => getRangePanelViewDates(viewDate(), panel()))
  const visibleDates = createMemo(() => props.panelCount === 1 || (picker() !== 'date' && picker() !== 'week') ? [panelDates()[0]] : panelDates())
  const startText = createMemo(() => formatDatePickerValue(value().start ?? null, { picker: picker(), weekStartsOn: props.weekStartsOn }))
  const endText = createMemo(() => formatDatePickerValue(value().end ?? null, { picker: picker(), weekStartsOn: props.weekStartsOn }))
  const hasValue = createMemo(() => Boolean(startText() || endText()))

  function setOpen(next: boolean) {
    if (props.open === undefined) setLocalOpen(next)
    if (next) setPending(value())
    if (!next) { setPanel(getDefaultPanelByPicker(picker())); setFocusedPart(null) }
    props.onOpenChange?.(next)
  }
  function close() { setOpen(false) }
  function commit(next: CalendarRange<CalendarValue>) { if (props.value === undefined) setLocalValue(next); props.onChange?.(next) }
  function clear() {
    const allowed = props.allowEmpty === true ? { start: true, end: true } : typeof props.allowEmpty === 'object' ? props.allowEmpty : {}
    const current = activeValue()
    const next: CalendarRange<CalendarValue> = {}
    if (!allowed.start && current.start) next.start = current.start
    if (!allowed.end && current.end) next.end = current.end
    setPending(next)
    commit(next)
  }
  function focus(part: DatePickerInputPart) { setActivePart(part); setFocusedPart(part) }
  function input(part: DatePickerInputPart, text: string) {
    focus(part)
    const parsed = parseDatePickerValue(text, { picker: picker(), weekStartsOn: props.weekStartsOn })
    if (!parsed.valid) return
    const next = createNextRangeValue(activeValue(), parsed.value, part, props.order ?? true)
    if (props.needConfirm) setPending(next)
    else commit(next)
  }
  function select(cell: CalendarCell) {
    const date = getCalendarValueDate(cell.value)
    setViewDate(date)
    if (cell.panel === 'year' && picker() !== 'year') { setPanel(picker() === 'month' || picker() === 'quarter' ? getDefaultPanelByPicker(picker()) : 'month'); return }
    if (cell.panel === 'month' && picker() !== 'month') { setPanel('date'); return }
    const next = createNextRangeValue(activeValue(), normalizeDatePickerValue(date, picker(), props.weekStartsOn), activePart(), props.order ?? true)
    if (props.needConfirm) setPending(next)
    else commit(next)
    if (activePart() === 'start') {
      setActivePart('end')
      setFocusedPart('end')
    }
    else if (next.start && next.end && !props.needConfirm) close()
  }
  const disabledDate = () => createDatePickerDisabledDate({ picker: picker(), panel: panel(), ...(props.minDate ? { minDate: props.minDate } : {}), ...(props.maxDate ? { maxDate: props.maxDate } : {}), ...(props.disabledDate ? { disabledDate: date => Boolean(props.disabledDate?.(date, activePart())) } : {}) })

  return <Popover open={props.open ?? localOpen()} trigger={props.disabled ? [] : ['focus', 'click']} onOpenChange={setOpen}>
    <PopoverTrigger>{(trigger) => <div {...(trigger.props as unknown as JSX.HTMLAttributes<HTMLDivElement>)} ref={trigger.ref as unknown as JSX.HTMLAttributes<HTMLDivElement>['ref']} class={props.class}>
      <InputRoot value={`${startText()}${endText()}`} disabled={props.disabled} readOnly={props.readOnly} class="cursor-pointer gap-0" onClear={clear}>
        <Show when={props.prefix}><InputPrefix>{props.prefix}</InputPrefix></Show>
        <InputRoot data-range-part="start" data-active={focusedPart() === 'start' || undefined} value={startText()} readOnly={props.readOnly} class={datePickerRangeInputClassName} onValueChange={(text) => input('start', text)}><InputControl class="min-w-0 px-2 text-center" placeholder="开始日期" onFocus={() => focus('start')} onClick={(event) => { event.stopPropagation(); if (!props.disabled) setOpen(true); focus('start') }} /></InputRoot>
        <span aria-hidden="true" class="inline-flex shrink-0 items-center justify-center px-1 text-muted-foreground">→</span>
        <InputRoot data-range-part="end" data-active={focusedPart() === 'end' || undefined} value={endText()} readOnly={props.readOnly} class={datePickerRangeInputClassName} onValueChange={(text) => input('end', text)}><InputControl class="min-w-0 px-2 text-center" placeholder="结束日期" onFocus={() => focus('end')} onClick={(event) => { event.stopPropagation(); if (!props.disabled) setOpen(true); focus('end') }} /></InputRoot>
        <Show when={props.allowClear ?? true}><InputClear /></Show>
        <Show when={!(props.allowClear ?? true) || !hasValue()}><InputSuffix>{props.suffix ?? <CalendarIcon />}</InputSuffix></Show>
      </InputRoot>
    </div>}</PopoverTrigger>
    <PopoverPortal><PopoverContent class={datePickerContentClassName}><div class={datePickerPanelsClassName}>
      <For each={visibleDates()}>{(date) => <CalendarRoot class={datePickerPanelClassName} range={activeValue()} viewDate={date} panel={panel()} granularity={getGranularityByPicker(picker())} weekStartsOn={props.weekStartsOn ?? 0} disabledDate={(current) => disabledDate()(current, { activePart: activePart(), from: getRangeFromValue(activeValue(), activePart()), rangeValue: activeValue() })} onCellSelect={select} onPanelChange={setPanel}>
        <CalendarHeader>{(header) => { const datePanel = header.panel === 'date'; const yearPanel = header.panel === 'year' || header.panel === 'decade'; const step = yearPanel ? 10 : 1; return <div class={datePickerHeaderClassName}><div class="flex items-center gap-1"><Button variant="ghost" size="icon-sm" class={datePickerHeaderNavigationClassName} onClick={() => setViewDate({ ...header.viewDate, year: header.viewDate.year - step })}><ChevronLeftIcon class="size-4" /><ChevronLeftIcon class="-ml-2 size-4" /></Button><Show when={datePanel}><Button variant="ghost" size="icon-sm" class={datePickerHeaderNavigationClassName} onClick={header.previousMonth}><ChevronLeftIcon class="size-4" /></Button></Show></div><div class="flex items-center gap-2 text-base font-semibold"><Button variant="ghost" size="sm" class={datePickerHeaderLabelClassName} onClick={() => header.setPanel('year')}>{header.panel === 'decade' ? `${Math.floor(header.viewDate.year / 10) * 10}-${Math.floor(header.viewDate.year / 10) * 10 + 9}年` : `${header.viewDate.year}年`}</Button><Show when={picker() !== 'year' && datePanel}><Button variant="ghost" size="sm" class={datePickerHeaderLabelClassName} onClick={() => header.setPanel('month')}>{header.viewDate.month}月</Button></Show></div><div class="flex items-center gap-1"><Show when={datePanel}><Button variant="ghost" size="icon-sm" class={datePickerHeaderNavigationClassName} onClick={header.nextMonth}><ChevronRightIcon class="size-4" /></Button></Show><Button variant="ghost" size="icon-sm" class={datePickerHeaderNavigationClassName} onClick={() => setViewDate({ ...header.viewDate, year: header.viewDate.year + step })}><ChevronRightIcon class="size-4" /><ChevronRightIcon class="-ml-2 size-4" /></Button></div></div> }}</CalendarHeader>
        <Show when={panel() === 'date'}><CalendarWeekHeader class={datePickerWeekHeaderClassName} /></Show>
        <CalendarGrid class={datePickerGridClassName} data-panel={panel()}>{(cell) => <PrimitiveCalendarCell cell={cell} class={datePickerCellClassName} />}</CalendarGrid>
      </CalendarRoot>}</For>
    </div><Show when={props.needConfirm}><div class={datePickerFooterClassName}><Button type="button" variant="outline" onClick={() => { setPending(value()); close() }}>取消</Button><Button type="button" onClick={() => { commit(pending()); close() }}>确认</Button></div></Show></PopoverContent></PopoverPortal>
  </Popover>
}
