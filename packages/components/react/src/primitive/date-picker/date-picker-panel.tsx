import {
  getCalendarValueDate,
  type CalendarCell as CoreCalendarCell,
  type CalendarDate,
  type CalendarPanel,
  type CalendarValue,
} from '@fex/components-core/calendar'
import { getDefaultPanelByPicker, getGranularityByPicker } from '@fex/components-core/date-picker/panel'
import { createNextRangeValue } from '@fex/components-core/date-picker/range'
import { normalizeDatePickerValue } from '@fex/components-core/date-picker/value'
import { calendarCellClassName } from '@fex/components-styles/calendar'
import { cn } from '@fex/utils'
import type { ComponentProps, ReactNode } from 'react'
import { CalendarCell, CalendarGrid, CalendarRoot, CalendarWeekHeader } from '../calendar/calendar'
import { useCalendarContext } from '../calendar/calendar-context'
import { DatePickerHeader, DatePickerHeaderButton, DatePickerHeaderLabel, DatePickerHeaderTitle } from './date-picker-header'
import { useDatePickerContext, useRangePickerContext } from './context'

function getNextPanelAfterCell(panel: CalendarPanel, picker: string): CalendarPanel | null {
  if (picker === 'year') return null
  if (panel === 'decade') return 'year'
  if (panel === 'year') return picker === 'month' || picker === 'quarter' ? getDefaultPanelByPicker(picker as 'month' | 'quarter') : 'month'
  if (panel === 'month') return picker === 'month' ? null : 'date'
  if (panel === 'quarter') return null
  return null
}

export interface DatePickerPanelProps<TValue extends CalendarValue = CalendarValue>
  extends Omit<ComponentProps<typeof CalendarRoot<TValue>>, 'value' | 'values' | 'defaultValue' | 'onValueChange'> {
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
      className={cn('min-w-72', className)}
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
        <div className="flex items-center gap-1">
          <DatePickerHeaderButton action={yearPanel ? 'previous-panel' : 'previous-year'} />
          {datePanel ? <DatePickerHeaderButton action="previous-month" /> : null}
        </div>
        <DatePickerHeaderTitle>
          <DatePickerHeaderLabel part="year" />
          <DatePickerHeaderLabel part="month" />
        </DatePickerHeaderTitle>
        <div className="flex items-center gap-1">
          {datePanel ? <DatePickerHeaderButton action="next-month" /> : null}
          <DatePickerHeaderButton action={yearPanel ? 'next-panel' : 'next-year'} />
        </div>
      </DatePickerHeader>
      {datePanel ? <CalendarWeekHeader className="grid grid-cols-7 px-3 py-2 text-center text-sm text-muted-foreground [&>[data-slot=calendar-week-head]]:py-1" /> : null}
      <CalendarGrid className={cn('grid gap-0 p-3 [&>[data-slot=calendar-row]]:grid [&>[data-slot=calendar-row]]:gap-0', datePanel ? '[&>[data-slot=calendar-row]]:grid-cols-7' : '[&>[data-slot=calendar-row]]:grid-cols-4')}>
        {(cell) => (
          <CalendarCell
            cell={cell}
            className={calendarCellClassName}
          />
        )}
      </CalendarGrid>
    </>
  )
}

export interface RangePickerPanelProps<TValue extends CalendarValue = CalendarValue>
  extends Omit<ComponentProps<typeof CalendarRoot<TValue>>, 'value' | 'range' | 'defaultValue' | 'onValueChange'> {
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
  const displayRange = context.activePart === 'end' && context.rangeValue.start && context.hoverValue
    ? createNextRangeValue(context.rangeValue, context.hoverValue, context.activePart)
    : context.rangeValue

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
      className={cn('min-w-72', className)}
    >
      {children ?? <DefaultDatePickerPanelContent />}
    </CalendarRoot>
  )
}
