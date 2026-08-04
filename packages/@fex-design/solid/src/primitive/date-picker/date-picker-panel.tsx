import {
  getCalendarValueDate,
  type CalendarCell as CoreCalendarCell,
  type CalendarDate,
  type CalendarPanel,
  type CalendarValue,
} from '@fex-design/core/calendar'
import {
  getDefaultPanelByPicker,
  getGranularityByPicker,
} from '@fex-design/core/date-picker/panel'
import { createRangePreviewValue } from '@fex-design/core/date-picker/range'
import { normalizeDatePickerValue } from '@fex-design/core/date-picker/value'
import {
  datePickerCellClassName,
  datePickerGridClassName,
  datePickerHeaderSideClassName,
  datePickerPanelClassName,
  datePickerWeekHeaderClassName,
} from '@fex-design/styles/date-picker'
import { cn } from '@fex/utils'
import { Show, splitProps, type ParentProps } from 'solid-js'
import {
  CalendarGrid,
  CalendarRoot,
  CalendarWeekHeader,
  type CalendarRootProps,
} from '../calendar/calendar'
import { useCalendarContext } from '../calendar/calendar-context'
import { useDatePickerContext, useRangePickerContext } from './context'
import {
  DatePickerHeader,
  DatePickerHeaderButton,
  DatePickerHeaderLabel,
  DatePickerHeaderTitle,
} from './date-picker-header'

function getNextPanelAfterCell(panel: CalendarPanel, picker: string): CalendarPanel | null {
  if (picker === 'year') return null
  if (panel === 'decade') return 'year'
  if (panel === 'year')
    return picker === 'month' || picker === 'quarter'
      ? getDefaultPanelByPicker(picker as 'month' | 'quarter')
      : 'month'
  if (panel === 'month') return picker === 'month' ? null : 'date'
  if (panel === 'quarter') return null
  return null
}

export interface DatePickerPanelProps<
  TValue extends CalendarValue = CalendarValue,
> extends ParentProps<
  Omit<CalendarRootProps<TValue>, 'value' | 'values' | 'defaultValue' | 'onValueChange'>
> {}

export function DatePickerPanel<TValue extends CalendarValue = CalendarValue>(
  props: DatePickerPanelProps<TValue>,
) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const context = useDatePickerContext('DatePickerPanel')
  function selectCell(cell: CoreCalendarCell) {
    const nextPanel = getNextPanelAfterCell(cell.panel, context.picker)
    const nextViewDate = getCalendarValueDate(cell.value)
    if (nextPanel) {
      context.setViewDate(nextViewDate)
      context.setPanel(nextPanel)
      return
    }
    context.select(
      normalizeDatePickerValue(nextViewDate, context.picker, context.weekStartsOn) as never,
    )
  }
  return (
    <CalendarRoot
      {...rest}
      value={context.calendarValue() as TValue | null}
      values={context.calendarValues() as readonly TValue[]}
      viewDate={context.viewDate()}
      panel={context.panel()}
      granularity={getGranularityByPicker(context.picker)}
      weekStartsOn={context.weekStartsOn}
      min={context.minDate}
      max={context.maxDate}
      disabledDate={context.disabledDate}
      onCellSelect={selectCell}
      onPanelChange={context.setPanel}
      onViewDateChange={context.setViewDate}
      class={cn(datePickerPanelClassName, local.class)}
    >
      {local.children ?? <DefaultDatePickerPanelContent />}
    </CalendarRoot>
  )
}

export function DefaultDatePickerPanelContent() {
  const calendar = useCalendarContext('DefaultDatePickerPanelContent')
  const datePanel = () => calendar.panel() === 'date'
  const yearPanel = () => calendar.panel() === 'year' || calendar.panel() === 'decade'
  return (
    <>
      <DatePickerHeader>
        <div class={datePickerHeaderSideClassName}>
          <DatePickerHeaderButton action={yearPanel() ? 'previous-panel' : 'previous-year'} />
          <Show when={datePanel()}>
            <DatePickerHeaderButton action="previous-month" />
          </Show>
        </div>
        <DatePickerHeaderTitle>
          <DatePickerHeaderLabel part="year" />
          <Show when={datePanel()}>
            <DatePickerHeaderLabel part="month" />
          </Show>
        </DatePickerHeaderTitle>
        <div class={datePickerHeaderSideClassName}>
          <Show when={datePanel()}>
            <DatePickerHeaderButton action="next-month" />
          </Show>
          <DatePickerHeaderButton action={yearPanel() ? 'next-panel' : 'next-year'} />
        </div>
      </DatePickerHeader>
      <Show when={datePanel()}>
        <CalendarWeekHeader class={datePickerWeekHeaderClassName} />
      </Show>
      <CalendarGrid class={datePickerGridClassName} cellClass={datePickerCellClassName} />
    </>
  )
}

export interface RangePickerPanelProps<
  TValue extends CalendarValue = CalendarValue,
> extends ParentProps<
  Omit<CalendarRootProps<TValue>, 'value' | 'range' | 'defaultValue' | 'onValueChange'>
> {
  panelViewDate?: CalendarDate
}

export function RangePickerPanel<TValue extends CalendarValue = CalendarValue>(
  props: RangePickerPanelProps<TValue>,
) {
  const [local, rest] = splitProps(props, ['class', 'children', 'panelViewDate'])
  const context = useRangePickerContext('RangePickerPanel')
  const displayRange = () =>
    createRangePreviewValue(context.rangeValue(), context.hoverValue(), context.activePart())
  function selectCell(cell: CoreCalendarCell) {
    const nextPanel = getNextPanelAfterCell(cell.panel, context.picker)
    const nextViewDate = getCalendarValueDate(cell.value)
    if (nextPanel) {
      context.setViewDate(nextViewDate)
      context.setPanel(nextPanel)
      return
    }
    context.select(
      normalizeDatePickerValue(nextViewDate, context.picker, context.weekStartsOn) as never,
    )
  }
  return (
    <CalendarRoot
      {...rest}
      range={displayRange() as never}
      viewDate={local.panelViewDate ?? context.viewDate()}
      panel={context.panel()}
      granularity={getGranularityByPicker(context.picker)}
      weekStartsOn={context.weekStartsOn}
      min={context.minDate}
      max={context.maxDate}
      disabledDate={(date) => context.disabledDate?.(date, context.activePart()) ?? false}
      onCellSelect={selectCell}
      onCellHover={(cell) => context.setHoverValue(cell.value as TValue)}
      onPanelChange={context.setPanel}
      onViewDateChange={context.setViewDate}
      onMouseLeave={() => context.setHoverValue(null)}
      class={cn(datePickerPanelClassName, local.class)}
    >
      {local.children ?? <DefaultDatePickerPanelContent />}
    </CalendarRoot>
  )
}
