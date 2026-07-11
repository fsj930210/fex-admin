import {
  addDate,
  createCalendarGrid,
  getCalendarToday,
  subtractDate,
  type CalendarCell as CoreCalendarCell,
  type CalendarDate,
  type CalendarGranularity,
  type CalendarPanel,
  type CalendarValue,
  type CalendarWeekday,
} from '@fex/components-core/calendar'
import { cn } from '@fex/utils'
import { Fragment, type ComponentProps, type ReactNode } from 'react'
import { useControllableState } from '../../hooks/use-controllable-state'
import { CalendarContext, useCalendarContext } from './calendar-context'

export type CalendarCell<TValue extends CalendarValue = CalendarValue> = CoreCalendarCell<TValue>

export interface CalendarRootProps<TValue extends CalendarValue = CalendarValue> extends Omit<
  ComponentProps<'div'>,
  'defaultValue' | 'onChange'
> {
  value?: TValue | null
  defaultValue?: TValue | null
  viewDate?: CalendarDate
  defaultViewDate?: CalendarDate
  panel?: CalendarPanel
  defaultPanel?: CalendarPanel
  granularity?: CalendarGranularity
  weekStartsOn?: CalendarWeekday
  today?: CalendarDate
  min?: CalendarDate
  max?: CalendarDate
  disabledDate?: (date: CalendarDate) => boolean
  onValueChange?: (value: TValue) => void
  onViewDateChange?: (viewDate: CalendarDate) => void
  onPanelChange?: (panel: CalendarPanel) => void
}

export function CalendarRoot<TValue extends CalendarValue = CalendarValue>({
  value,
  defaultValue = null,
  viewDate,
  defaultViewDate,
  panel,
  defaultPanel = 'date',
  granularity = 'date',
  weekStartsOn = 0,
  today,
  min,
  max,
  disabledDate,
  onValueChange,
  onViewDateChange,
  onPanelChange,
  className,
  children,
  ...props
}: CalendarRootProps<TValue>) {
  const fallbackViewDate = defaultViewDate ?? getCalendarToday()
  const valueChangeProps = onValueChange
    ? {
        onChange: (nextValue: TValue | null) => {
          if (nextValue) onValueChange(nextValue)
        },
      }
    : {}
  const [currentValue, setCurrentValue] = useControllableState<TValue | null>(
    {
      value,
      defaultValue,
      ...valueChangeProps,
    },
    { defaultValue: null },
  )
  const [currentViewDate, setCurrentViewDate] = useControllableState<CalendarDate>(
    { value: viewDate, defaultValue: fallbackViewDate, onChange: onViewDateChange },
    { defaultValue: fallbackViewDate },
  )
  const [currentPanel, setCurrentPanel] = useControllableState<CalendarPanel>(
    { value: panel, defaultValue: defaultPanel, onChange: onPanelChange },
    { defaultValue: defaultPanel },
  )
  const grid = createCalendarGrid<TValue>({
    viewDate: currentViewDate,
    panel: currentPanel,
    granularity,
    weekStartsOn,
    ...(today ? { today } : {}),
    ...(min ? { min } : {}),
    ...(max ? { max } : {}),
    ...(disabledDate ? { disabledDate } : {}),
    ...(currentValue ? { value: currentValue } : {}),
  })

  return (
    <CalendarContext
      value={{
        grid,
        value: currentValue,
        viewDate: currentViewDate,
        panel: currentPanel,
        granularity,
        weekStartsOn,
        setViewDate: setCurrentViewDate,
        setPanel: setCurrentPanel,
        selectCell: (cell) => {
          if (cell.state.disabled) return
          setCurrentValue(cell.value as TValue)
        },
      }}
    >
      <div
        {...props}
        data-slot="calendar-root"
        data-panel={currentPanel}
        data-granularity={granularity}
        className={className}
      >
        {children}
      </div>
    </CalendarContext>
  )
}

export interface CalendarHeaderProps extends Omit<ComponentProps<'div'>, 'children'> {
  children: (context: {
    viewDate: CalendarDate
    panel: CalendarPanel
    granularity: CalendarGranularity
    previousYear: () => void
    previousMonth: () => void
    nextMonth: () => void
    nextYear: () => void
    previous: () => void
    next: () => void
    setPanel: (panel: CalendarPanel) => void
  }) => ReactNode
}

export function CalendarHeader({ children, className, ...props }: CalendarHeaderProps) {
  const context = useCalendarContext('CalendarHeader')

  function shiftByPanel(offset: number) {
    if (context.panel === 'date') {
      context.setViewDate(addDate(context.viewDate, { months: offset }))
      return
    }
    if (context.panel === 'month' || context.panel === 'quarter') {
      context.setViewDate(addDate(context.viewDate, { years: offset }))
      return
    }
    context.setViewDate(addDate(context.viewDate, { years: offset * 10 }))
  }

  function shiftMonth(offset: number) {
    context.setViewDate(addDate(context.viewDate, { months: offset }))
  }

  function shiftYear(offset: number) {
    context.setViewDate(addDate(context.viewDate, { years: offset }))
  }

  return (
    <div {...props} data-slot="calendar-header" className={className}>
      {children({
        viewDate: context.viewDate,
        panel: context.panel,
        granularity: context.granularity,
        previousYear: () => shiftYear(-1),
        previousMonth: () => shiftMonth(-1),
        nextMonth: () => shiftMonth(1),
        nextYear: () => shiftYear(1),
        previous: () => shiftByPanel(-1),
        next: () => shiftByPanel(1),
        setPanel: context.setPanel,
      })}
    </div>
  )
}

export type CalendarNavigationAction =
  | 'previous-year'
  | 'previous-month'
  | 'next-month'
  | 'next-year'
  | 'previous-panel'
  | 'next-panel'

export interface CalendarNavigationButtonProps extends ComponentProps<'button'> {
  action: CalendarNavigationAction
}

export function CalendarNavigationButton({
  action,
  type = 'button',
  onClick,
  children,
  ...props
}: CalendarNavigationButtonProps) {
  const context = useCalendarContext('CalendarNavigationButton')

  function runAction() {
    if (action === 'previous-year') {
      context.setViewDate(subtractDate(context.viewDate, { years: 1 }))
      return
    }
    if (action === 'previous-month') {
      context.setViewDate(subtractDate(context.viewDate, { months: 1 }))
      return
    }
    if (action === 'next-month') {
      context.setViewDate(addDate(context.viewDate, { months: 1 }))
      return
    }
    if (action === 'next-year') {
      context.setViewDate(addDate(context.viewDate, { years: 1 }))
      return
    }
    if (action === 'previous-panel') {
      context.setViewDate(
        context.panel === 'date'
          ? subtractDate(context.viewDate, { months: 1 })
          : subtractDate(context.viewDate, { years: 1 }),
      )
      return
    }
    context.setViewDate(
      context.panel === 'date'
        ? addDate(context.viewDate, { months: 1 })
        : addDate(context.viewDate, { years: 1 }),
    )
  }

  return (
    <button
      {...props}
      type={type}
      data-slot="calendar-navigation-button"
      data-action={action}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        runAction()
      }}
    >
      {children}
    </button>
  )
}

export interface CalendarWeekHeaderProps extends ComponentProps<'div'> {
  labels?: readonly string[]
}

export function CalendarWeekHeader({
  labels = ['日', '一', '二', '三', '四', '五', '六'],
  className,
  ...props
}: CalendarWeekHeaderProps) {
  const context = useCalendarContext('CalendarWeekHeader')
  const orderedLabels = labels.map((_, index) => labels[(index + context.weekStartsOn) % 7] ?? '')

  return (
    <div {...props} data-slot="calendar-week-header" className={className}>
      {orderedLabels.map((label) => (
        <div key={label} data-slot="calendar-week-head">
          {label}
        </div>
      ))}
    </div>
  )
}

export interface CalendarGridProps<TValue extends CalendarValue = CalendarValue> extends Omit<
  ComponentProps<'div'>,
  'children'
> {
  children?: (cell: CalendarCell<TValue>) => ReactNode
}

export function CalendarGrid<TValue extends CalendarValue = CalendarValue>({
  children,
  className,
  ...props
}: CalendarGridProps<TValue>) {
  const context = useCalendarContext('CalendarGrid')

  return (
    <div {...props} data-slot="calendar-grid" className={className}>
      {context.grid.rows.map((row) => (
        <div key={row.map((cell) => cell.key).join('|')} data-slot="calendar-row">
          {row.map((cell) =>
            children ? (
              <Fragment key={cell.key}>{children(cell as CalendarCell<TValue>)}</Fragment>
            ) : (
              <CalendarCell key={cell.key} cell={cell} />
            ),
          )}
        </div>
      ))}
    </div>
  )
}

export interface CalendarCellProps<TValue extends CalendarValue = CalendarValue> extends Omit<
  ComponentProps<'button'>,
  'children' | 'value' | 'onSelect'
> {
  cell: CalendarCell<TValue>
  children?: ReactNode | ((cell: CalendarCell<TValue>) => ReactNode)
}

export function CalendarCell<TValue extends CalendarValue = CalendarValue>({
  cell,
  children,
  className,
  onClick,
  ...props
}: CalendarCellProps<TValue>) {
  const context = useCalendarContext('CalendarCell')
  const content = typeof children === 'function' ? children(cell) : (children ?? cell.label)

  return (
    <button
      {...props}
      type="button"
      data-slot="calendar-cell"
      data-today={cell.state.today ? 'true' : undefined}
      data-outside={cell.state.outside ? 'true' : undefined}
      data-selected={cell.state.selected ? 'true' : undefined}
      data-disabled={cell.state.disabled ? 'true' : undefined}
      disabled={cell.state.disabled}
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        context.selectCell(cell)
      }}
    >
      {content}
    </button>
  )
}
