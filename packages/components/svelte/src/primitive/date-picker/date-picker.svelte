<script lang="ts">
  import { getCalendarToday, getCalendarValueDate, type CalendarCell, type CalendarDate, type CalendarPanel, type CalendarValue, type CalendarWeekday } from '@fex/components-core/calendar'
  import { createDatePickerDisabledDate } from '@fex/components-core/date-picker/constraints'
  import { getDefaultPanelByPicker, getGranularityByPicker } from '@fex/components-core/date-picker/panel'
  import { formatDatePickerValue, normalizeDatePickerValue, parseDatePickerValue } from '@fex/components-core/date-picker/value'
  import type { DatePickerPicker } from '@fex/components-core/date-picker/types'
  import { datePickerCellClassName, datePickerContentClassName, datePickerFooterClassName, datePickerGridClassName, datePickerHeaderClassName, datePickerHeaderLabelClassName, datePickerHeaderNavigationClassName, datePickerPanelClassName, datePickerWeekHeaderClassName } from '@fex/components-styles/date-picker'
  import type { Snippet } from 'svelte'
  import CalendarIcon from '../../icon/calendar.svelte'
  import ChevronLeftIcon from '../../icon/chevron-left.svelte'
  import ChevronRightIcon from '../../icon/chevron-right.svelte'
  import CloseIcon from '../../icon/close.svelte'
  import Button from '../../ui/button/button.svelte'
  import CalendarCellView from '../calendar/calendar-cell.svelte'
  import CalendarGrid from '../calendar/calendar-grid.svelte'
  import CalendarHeader from '../calendar/calendar-header.svelte'
  import CalendarRoot from '../calendar/calendar.svelte'
  import CalendarWeekHeader from '../calendar/calendar-week-header.svelte'
  import InputClear from '../input/input-clear.svelte'
  import InputControl from '../input/input-control.svelte'
  import InputPrefix from '../input/input-prefix.svelte'
  import InputRoot from '../input/input-root.svelte'
  import InputSuffix from '../input/input-suffix.svelte'
  import Popover from '../popover/popover.svelte'
  import PopoverContent from '../popover/popover-content.svelte'
  import PopoverPortal from '../popover/popover-portal.svelte'
  import PopoverTrigger from '../popover/popover-trigger.svelte'

  interface Props {
    class?: string | undefined
    value?: CalendarValue | readonly CalendarValue[] | null | undefined
    defaultValue?: CalendarValue | readonly CalendarValue[] | null | undefined
    open?: boolean | undefined
    defaultOpen?: boolean | undefined
    picker?: DatePickerPicker | undefined
    multiple?: boolean | undefined
    needConfirm?: boolean | undefined
    disabled?: boolean | undefined
    readOnly?: boolean | undefined
    allowClear?: boolean | undefined
    placeholder?: string | undefined
    format?: string | undefined
    weekStartsOn?: CalendarWeekday | undefined
    minDate?: CalendarDate | undefined
    maxDate?: CalendarDate | undefined
    disabledDate?: ((date: CalendarDate) => boolean) | undefined
    prefix?: Snippet | undefined
    suffix?: Snippet | undefined
    panel?: Snippet<[{ close: () => void; clear: () => void; confirm: () => void; cancel: () => void }]> | undefined
    footer?: Snippet<[{ close: () => void; clear: () => void; confirm: () => void; cancel: () => void }]> | undefined
    onChange?: ((value: CalendarValue | readonly CalendarValue[] | null) => void) | undefined
    onOpenChange?: ((open: boolean) => void) | undefined
  }
  let { class: className, value, defaultValue, open, defaultOpen = false, picker = 'date', multiple = false, needConfirm: needConfirmProp, disabled = false, readOnly = false, allowClear = true, placeholder, format, weekStartsOn = 0, minDate, maxDate, disabledDate: disabledDateProp, prefix, suffix, panel: customPanel, footer, onChange, onOpenChange }: Props = $props()
  let localValue = $state<CalendarValue | readonly CalendarValue[] | null>(defaultValue ?? (multiple ? [] : null))
  let localOpen = $state(defaultOpen)
  let pendingValue = $state<CalendarValue | readonly CalendarValue[] | null>(localValue)
  let currentPanel = $state<CalendarPanel>(getDefaultPanelByPicker(picker))
  let currentViewDate = $state(getCalendarToday())
  let text = $state('')
  const needsConfirm = $derived(needConfirmProp ?? multiple)
  const currentValue = $derived(value ?? localValue)
  const activeValue = $derived(needsConfirm ? pendingValue : currentValue)
  const displayed = $derived(Array.isArray(currentValue) ? currentValue.map((item) => formatDatePickerValue(item, { picker, format, weekStartsOn })).join(', ') : formatDatePickerValue(currentValue as CalendarValue | null, { picker, format, weekStartsOn }))
  const inputValue = $derived(text || displayed)
  const selectionProps: { value: CalendarValue | null; values?: readonly CalendarValue[] } = $derived(Array.isArray(activeValue) ? { value: null, values: activeValue } : { value: activeValue as CalendarValue | null })
  const calendarDisabledDate = $derived(createDatePickerDisabledDate({ picker, panel: currentPanel, ...(minDate ? { minDate } : {}), ...(maxDate ? { maxDate } : {}), ...(disabledDateProp ? { disabledDate: disabledDateProp } : {}) }))
  function setOpen(next: boolean) { if (open === undefined) localOpen = next; if (next) pendingValue = currentValue; if (!next) currentPanel = getDefaultPanelByPicker(picker); onOpenChange?.(next) }
  function close() { setOpen(false) }
  function commit(next: CalendarValue | readonly CalendarValue[] | null) { if (value === undefined) localValue = next; text = ''; onChange?.(next) }
  function clear() { const next = multiple ? [] : null; pendingValue = next; commit(next) }
  function confirm() { commit(pendingValue); close() }
  function cancel() { pendingValue = currentValue; close() }
  const actions = { close, clear, confirm, cancel }
  function select(next: CalendarValue) { if (multiple) { const values = Array.isArray(activeValue) ? activeValue : []; const key = formatDatePickerValue(next, { picker }); const nextValues = values.some(item => formatDatePickerValue(item, { picker }) === key) ? values.filter(item => formatDatePickerValue(item, { picker }) !== key) : [...values, next]; if (needsConfirm) pendingValue = nextValues; else commit(nextValues); return }; if (needsConfirm) pendingValue = next; else { commit(next); close() } }
  function removeMultipleValue(item: CalendarValue) { const values = Array.isArray(activeValue) ? activeValue : []; const next = values.filter(value => formatDatePickerValue(value, { picker }) !== formatDatePickerValue(item, { picker })); pendingValue = next; commit(next) }
  function selectCell(cell: CalendarCell) { const date = getCalendarValueDate(cell.value); currentViewDate = date; if (cell.panel === 'year' && picker !== 'year') { currentPanel = picker === 'month' || picker === 'quarter' ? getDefaultPanelByPicker(picker) : 'month'; return }; if (cell.panel === 'month' && picker !== 'month') { currentPanel = 'date'; return }; select(normalizeDatePickerValue(date, picker, weekStartsOn)) }
</script>

<Popover open={open ?? localOpen} trigger={disabled ? [] : ['focus', 'click']} onOpenChange={setOpen}>
  <PopoverTrigger>{#snippet children(slot)}<div use:slot.action role="button" tabindex={disabled ? -1 : 0} aria-disabled={disabled || undefined} aria-haspopup="dialog" aria-expanded={slot.state.open} data-state={slot.state.open ? 'open' : 'closed'} class={className} onclick={event => { if (!disabled) slot.props.onclick?.(event as never) }} onkeydown={event => { if (!disabled && (event.key === 'Enter' || event.key === ' ')) slot.props.onclick?.(event as never) }} onfocus={event => { if (!disabled) slot.props.onfocus?.(event as never) }} onblur={event => slot.props.onblur?.(event as never)}><InputRoot value={multiple ? '': inputValue} {disabled} readOnly={readOnly} onValueChange={next => { text = next; if (!multiple) { const parsed = parseDatePickerValue(next, { picker, format, weekStartsOn }); if (parsed.valid) select(parsed.value) } }} onClear={clear}>{#if prefix}<InputPrefix>{@render prefix()}</InputPrefix>{/if}{#if multiple && Array.isArray(currentValue) && currentValue.length}<div data-slot="date-picker-tags" class="flex min-w-0 flex-1 items-center gap-1 overflow-hidden px-2"><span data-slot="date-picker-tag" class="inline-flex shrink-0 items-center rounded bg-muted-background px-1.5 py-0.5 text-xs">{formatDatePickerValue(currentValue[0]!, { picker, format, weekStartsOn })}<Button type="button" variant="ghost" size="icon-xs" class="ml-1 text-muted-foreground" onclick={event => { event.stopPropagation(); removeMultipleValue(currentValue[0]!) }}><CloseIcon /></Button></span>{#if currentValue.length > 1}<span data-slot="date-picker-tag-overflow" title={displayed} class="inline-flex shrink-0 cursor-default items-center rounded bg-muted-background px-1.5 py-0.5 text-xs text-muted-foreground">+{currentValue.length - 1}</span>{/if}</div>{/if}<InputControl class={multiple && Array.isArray(currentValue) && currentValue.length ? 'w-8 min-w-8 flex-none px-1' : undefined} placeholder={multiple && Array.isArray(currentValue) && currentValue.length ? '' : placeholder ?? format ?? '请选择日期'} />{#if allowClear}<InputClear />{/if}{#if !allowClear || !inputValue}<InputSuffix>{#if suffix}{@render suffix()}{:else}<CalendarIcon />{/if}</InputSuffix>{/if}</InputRoot></div>{/snippet}</PopoverTrigger>
  <PopoverPortal><PopoverContent class={datePickerContentClassName} data-slot="date-picker-content">
    {#if customPanel}{@render customPanel(actions)}{:else}<CalendarRoot class={datePickerPanelClassName} {...selectionProps} viewDate={currentViewDate} panel={currentPanel} granularity={getGranularityByPicker(picker)} {weekStartsOn} disabledDate={calendarDisabledDate} onCellSelect={selectCell} onViewDateChange={next => currentViewDate = next} onPanelChange={next => currentPanel = next}>
      <CalendarHeader>{#snippet children(header)}{@const datePanel = header.panel === 'date'}{@const yearPanel = header.panel === 'year' || header.panel === 'decade'}{@const step = yearPanel ? 10 : 1}<div class={datePickerHeaderClassName}><div class="flex items-center gap-1"><Button variant="ghost" size="icon-sm" class={datePickerHeaderNavigationClassName} onclick={() => currentViewDate = { ...header.viewDate, year: header.viewDate.year - step }}><ChevronLeftIcon /><ChevronLeftIcon class="-ml-2" /></Button>{#if datePanel}<Button variant="ghost" size="icon-sm" class={datePickerHeaderNavigationClassName} onclick={header.previousMonth}><ChevronLeftIcon /></Button>{/if}</div><div class="flex items-center gap-2 text-base font-semibold"><Button variant="ghost" size="sm" class={datePickerHeaderLabelClassName} onclick={() => header.setPanel('year')}>{yearPanel && header.panel === 'decade' ? `${Math.floor(header.viewDate.year / 10) * 10}-${Math.floor(header.viewDate.year / 10) * 10 + 9}年` : `${header.viewDate.year}年`}</Button>{#if picker !== 'year' && datePanel}<Button variant="ghost" size="sm" class={datePickerHeaderLabelClassName} onclick={() => header.setPanel('month')}>{header.viewDate.month}月</Button>{/if}</div><div class="flex items-center gap-1">{#if datePanel}<Button variant="ghost" size="icon-sm" class={datePickerHeaderNavigationClassName} onclick={header.nextMonth}><ChevronRightIcon /></Button>{/if}<Button variant="ghost" size="icon-sm" class={datePickerHeaderNavigationClassName} onclick={() => currentViewDate = { ...header.viewDate, year: header.viewDate.year + step }}><ChevronRightIcon /><ChevronRightIcon class="-ml-2" /></Button></div></div>{/snippet}</CalendarHeader>
      {#if currentPanel === 'date'}<CalendarWeekHeader class={datePickerWeekHeaderClassName} />{/if}
      <CalendarGrid class={datePickerGridClassName} data-panel={currentPanel}>{#snippet children(cell)}<CalendarCellView {cell} class={datePickerCellClassName}>{cell.label}</CalendarCellView>{/snippet}</CalendarGrid>
    </CalendarRoot>{/if}
    {#if footer}{@render footer(actions)}{:else if needsConfirm}<div class={datePickerFooterClassName}><Button type="button" variant="outline" onclick={cancel}>取消</Button><Button type="button" onclick={confirm}>确认</Button></div>{/if}
  </PopoverContent></PopoverPortal>
</Popover>
