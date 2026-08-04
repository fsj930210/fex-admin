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
import type { ComponentProps, ReactNode } from 'react'
import { CalendarCell, CalendarGrid, CalendarRoot, CalendarWeekHeader } from '../calendar/calendar'
import { useCalendarContext } from '../calendar/calendar-context'
import {
  DatePickerHeader,
  DatePickerHeaderButton,
  DatePickerHeaderLabel,
  DatePickerHeaderTitle,
} from './date-picker-header'
import { useDatePickerContext, useRangePickerContext } from './context'

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

export interface DatePickerPanelProps<TValue extends CalendarValue = CalendarValue> extends Omit<
  ComponentProps<typeof CalendarRoot<TValue>>,
  'value' | 'values' | 'defaultValue' | 'onValueChange'
> {
  children?: ReactNode
}

export function DatePickerPanel<TValue extends CalendarValue = CalendarValue>({
  className,
  children,
  ...props
}: DatePickerPanelProps<TValue>) {
  const context = useDatePickerContext('DatePickerPanel')

  function selectCell(cell: CoreCalendarCell) {
    const nextPanel = getNextPanelAfterCell(cell.panel, context.picker)
    const nextViewDate = getCalendarValueDate(cell.value)
    if (nextPanel) {
      context.setViewDate(nextViewDate)
      context.setPanel(nextPanel)
      return
    }
    context.select(normalizeDatePickerValue(nextViewDate, context.picker, context.weekStartsOn))
  }

  return (
    <CalendarRoot
      {...props}
      value={context.calendarValue as TValue | null}
      values={context.calendarValues as readonly TValue[]}
      viewDate={context.viewDate}
      panel={context.panel}
      granularity={getGranularityByPicker(context.picker)}
      weekStartsOn={context.weekStartsOn}
      {...(context.minDate ? { min: context.minDate } : {})}
      {...(context.maxDate ? { max: context.maxDate } : {})}
      {...(context.disabledDate ? { disabledDate: context.disabledDate } : {})}
      onCellSelect={selectCell}
      onPanelChange={context.setPanel}
      onViewDateChange={context.setViewDate}
      className={cn(datePickerPanelClassName, className)}
    >
      {children ?? <DefaultDatePickerPanelContent />}
    </CalendarRoot>
  )
}

export function DefaultDatePickerPanelContent() {
  const calendar = useCalendarContext('DefaultDatePickerPanelContent')
  const datePanel = calendar.panel === 'date'
  const yearPanel = calendar.panel === 'year' || calendar.panel === 'decade'
  return (
    <>
      <DatePickerHeader>
        <div className={datePickerHeaderSideClassName}>
          <DatePickerHeaderButton action={yearPanel ? 'previous-panel' : 'previous-year'} />
          {datePanel ? <DatePickerHeaderButton action="previous-month" /> : null}
        </div>
        <DatePickerHeaderTitle>
          <DatePickerHeaderLabel part="year" />
          <DatePickerHeaderLabel part="month" />
        </DatePickerHeaderTitle>
        <div className={datePickerHeaderSideClassName}>
          {datePanel ? <DatePickerHeaderButton action="next-month" /> : null}
          <DatePickerHeaderButton action={yearPanel ? 'next-panel' : 'next-year'} />
        </div>
      </DatePickerHeader>
      {datePanel ? <CalendarWeekHeader className={datePickerWeekHeaderClassName} /> : null}
      <CalendarGrid className={datePickerGridClassName}>
        {(cell) => <CalendarCell cell={cell} className={datePickerCellClassName} />}
      </CalendarGrid>
    </>
  )
}

export interface RangePickerPanelProps<TValue extends CalendarValue = CalendarValue> extends Omit<
  ComponentProps<typeof CalendarRoot<TValue>>,
  'value' | 'range' | 'defaultValue' | 'onValueChange'
> {
  children?: ReactNode
  panelViewDate?: CalendarDate | undefined
}

export function RangePickerPanel<TValue extends CalendarValue = CalendarValue>({
  className,
  children,
  panelViewDate,
  ...props
}: RangePickerPanelProps<TValue>) {
  const context = useRangePickerContext('RangePickerPanel')
  const viewDate = panelViewDate ?? context.viewDate
  const displayRange = createRangePreviewValue(
    context.rangeValue,
    context.hoverValue,
    context.activePart,
  )

  function selectCell(cell: CoreCalendarCell) {
    const nextPanel = getNextPanelAfterCell(cell.panel, context.picker)
    const nextViewDate = getCalendarValueDate(cell.value)
    if (nextPanel) {
      context.setViewDate(nextViewDate)
      context.setPanel(nextPanel)
      return
    }
    context.select(normalizeDatePickerValue(nextViewDate, context.picker, context.weekStartsOn))
  }

  return (
    <CalendarRoot
      {...props}
      range={displayRange as never}
      viewDate={viewDate}
      panel={context.panel}
      granularity={getGranularityByPicker(context.picker)}
      weekStartsOn={context.weekStartsOn}
      {...(context.minDate ? { min: context.minDate } : {})}
      {...(context.maxDate ? { max: context.maxDate } : {})}
      disabledDate={(date) => context.disabledDate?.(date, context.activePart) ?? false}
      onCellSelect={selectCell}
      onCellHover={(cell) => context.setHoverValue(cell.value as TValue)}
      onPanelChange={context.setPanel}
      onViewDateChange={context.setViewDate}
      onMouseLeave={() => context.setHoverValue(null)}
      className={cn(datePickerPanelClassName, className)}
    >
      {children ?? <DefaultDatePickerPanelContent />}
    </CalendarRoot>
  )
}
