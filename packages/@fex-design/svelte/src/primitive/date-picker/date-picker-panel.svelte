<script lang="ts">
  import { getCalendarValueDate, type CalendarCell, type CalendarDate, type CalendarPanel } from '@fex-design/core/calendar'
  import { getDefaultPanelByPicker, getGranularityByPicker } from '@fex-design/core/date-picker/panel'
  import { createRangePreviewValue } from '@fex-design/core/date-picker/range'
  import { normalizeDatePickerValue } from '@fex-design/core/date-picker/value'
  import { datePickerCellClassName, datePickerGridClassName, datePickerHeaderSideClassName, datePickerPanelClassName, datePickerWeekHeaderClassName } from '@fex-design/styles/date-picker'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import { getContext } from 'svelte'
  import CalendarCellView from '../calendar/calendar-cell.svelte'
  import CalendarGrid from '../calendar/calendar-grid.svelte'
  import CalendarRoot from '../calendar/calendar.svelte'
  import CalendarWeekHeader from '../calendar/calendar-week-header.svelte'
  import { datePickerContextKey, rangePickerContextKey, type DatePickerContextValue, type RangePickerContextValue } from './context'
  import DatePickerHeader from './date-picker-header.svelte'
  import DatePickerHeaderButton from './date-picker-header-button.svelte'
  import DatePickerHeaderLabel from './date-picker-header-label.svelte'
  import DatePickerHeaderTitle from './date-picker-header-title.svelte'

  interface Props { class?: string | undefined; range?: boolean | undefined; panelViewDate?: CalendarDate | undefined; children?: Snippet | undefined }
  let { class: className, range = false, panelViewDate, children }: Props = $props()
  // svelte-ignore state_referenced_locally -- range selects the immutable context branch at mount.
  const datePicker = range ? undefined : getContext<DatePickerContextValue | undefined>(datePickerContextKey)
  // svelte-ignore state_referenced_locally -- range selects the immutable context branch at mount.
  const rangePicker = range ? getContext<RangePickerContextValue | undefined>(rangePickerContextKey) : undefined
  const owner = rangePicker ?? datePicker
  if (!owner) throw new Error('DatePickerPanel must be used within DatePickerRoot or RangePickerRoot')
  const resolvedOwner = owner
  const displayRange = $derived(rangePicker ? createRangePreviewValue(rangePicker.getRangeValue(), rangePicker.getHoverValue(), rangePicker.getActivePart()) : undefined)

  function nextPanelAfterCell(panel: CalendarPanel, picker: string): CalendarPanel | null {
    if (picker === 'year') return null
    if (panel === 'decade') return 'year'
    if (panel === 'year') return picker === 'month' || picker === 'quarter' ? getDefaultPanelByPicker(picker as 'month' | 'quarter') : 'month'
    if (panel === 'month') return picker === 'month' ? null : 'date'
    if (panel === 'quarter') return null
    return null
  }

  function selectCell(cell: CalendarCell) {
    const nextPanel = nextPanelAfterCell(cell.panel, resolvedOwner.picker)
    const nextViewDate = getCalendarValueDate(cell.value)
    if (nextPanel) {
      resolvedOwner.setViewDate(nextViewDate)
      resolvedOwner.setPanel(nextPanel)
      return
    }
    resolvedOwner.select(normalizeDatePickerValue(nextViewDate, resolvedOwner.picker, resolvedOwner.weekStartsOn) as never)
  }

  function disabledDate(date: CalendarDate) {
    return rangePicker ? rangePicker.disabledDate?.(date, rangePicker.getActivePart()) ?? false : datePicker?.disabledDate?.(date) ?? false
  }
</script>

<CalendarRoot class={cn(datePickerPanelClassName, className)} value={datePicker?.getCalendarValue()} values={datePicker?.getCalendarValues()} range={displayRange} viewDate={panelViewDate ?? owner.getViewDate()} panel={owner.getPanel()} granularity={getGranularityByPicker(owner.picker)} weekStartsOn={owner.weekStartsOn} min={owner.minDate} max={owner.maxDate} disabledDate={disabledDate} onCellSelect={selectCell} onCellHover={(cell) => rangePicker?.setHoverValue(cell.value)} onPanelChange={owner.setPanel} onViewDateChange={owner.setViewDate} onmouseleave={() => rangePicker?.setHoverValue(null)}>
  {#if children}
    {@render children()}
  {:else}
    <DatePickerHeader>
      <div class={datePickerHeaderSideClassName}>
        <DatePickerHeaderButton action={owner.getPanel() === 'date' ? 'previous-year' : 'previous-panel'} />
        {#if owner.getPanel() === 'date'}<DatePickerHeaderButton action="previous-month" />{/if}
      </div>
      <DatePickerHeaderTitle>
        <DatePickerHeaderLabel part="year" />
        <DatePickerHeaderLabel part="month" />
      </DatePickerHeaderTitle>
      <div class={datePickerHeaderSideClassName}>
        {#if owner.getPanel() === 'date'}<DatePickerHeaderButton action="next-month" />{/if}
        <DatePickerHeaderButton action={owner.getPanel() === 'date' ? 'next-year' : 'next-panel'} />
      </div>
    </DatePickerHeader>
    {#if owner.getPanel() === 'date'}<CalendarWeekHeader class={datePickerWeekHeaderClassName} />{/if}
    <CalendarGrid class={datePickerGridClassName}>{#snippet children(cell)}<CalendarCellView {cell} class={datePickerCellClassName}>{cell.label}</CalendarCellView>{/snippet}</CalendarGrid>
  {/if}
</CalendarRoot>
