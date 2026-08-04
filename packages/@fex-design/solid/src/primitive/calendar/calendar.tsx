import {
  addDate,
  createCalendarGrid,
  getCalendarToday,
  subtractDate,
  type CalendarCell as CoreCalendarCell,
  type CalendarDate,
  type CalendarGranularity,
  type CalendarPanel,
  type CalendarRange,
  type CalendarValue,
  type CalendarWeekday,
} from '@fex-design/core/calendar'
import { cn } from '@fex/utils'
import {
  createMemo,
  createSignal,
  For,
  Index,
  splitProps,
  type Accessor,
  type JSX,
  type ParentProps,
} from 'solid-js'
import { CalendarContext, useCalendarContext } from './calendar-context'

export type CalendarCellModel<TValue extends CalendarValue = CalendarValue> =
  CoreCalendarCell<TValue>

export interface CalendarRootProps<TValue extends CalendarValue = CalendarValue> extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  value?: TValue | null | undefined
  values?: readonly TValue[] | undefined
  range?: CalendarRange<TValue> | undefined
  defaultValue?: TValue | null | undefined
  viewDate?: CalendarDate | undefined
  defaultViewDate?: CalendarDate | undefined
  panel?: CalendarPanel | undefined
  defaultPanel?: CalendarPanel | undefined
  granularity?: CalendarGranularity | undefined
  weekStartsOn?: CalendarWeekday | undefined
  today?: CalendarDate | undefined
  min?: CalendarDate | undefined
  max?: CalendarDate | undefined
  disabledDate?: ((date: CalendarDate) => boolean) | undefined
  onValueChange?: (value: TValue) => void
  onCellSelect?: (cell: CoreCalendarCell<TValue>) => void
  onCellHover?: (cell: CoreCalendarCell<TValue>) => void
  onViewDateChange?: (viewDate: CalendarDate) => void
  onPanelChange?: (panel: CalendarPanel) => void
}

export function CalendarRoot<TValue extends CalendarValue = CalendarValue>(
  props: ParentProps<CalendarRootProps<TValue>>,
) {
  const [local, rest] = splitProps(props, [
    'value',
    'values',
    'range',
    'defaultValue',
    'viewDate',
    'defaultViewDate',
    'panel',
    'defaultPanel',
    'granularity',
    'weekStartsOn',
    'today',
    'min',
    'max',
    'disabledDate',
    'onValueChange',
    'onCellSelect',
    'onCellHover',
    'onViewDateChange',
    'onPanelChange',
    'children',
  ])
  const [internalValue, setInternalValue] = createSignal<TValue | null>(local.defaultValue ?? null)
  const [internalViewDate, setInternalViewDate] = createSignal(
    local.defaultViewDate ?? getCalendarToday(),
  )
  const [internalPanel, setInternalPanel] = createSignal<CalendarPanel>(
    local.defaultPanel ?? 'date',
  )
  const [hoveredRowIndex, setHoveredRowIndex] = createSignal<number | null>(null)
  const currentValue = () => local.value ?? internalValue()
  const currentViewDate = () => local.viewDate ?? internalViewDate()
  const currentPanel = () => local.panel ?? internalPanel()
  const granularity = () => local.granularity ?? 'date'
  const weekStartsOn = () => local.weekStartsOn ?? 0
  const grid = createMemo(() =>
    createCalendarGrid<TValue>({
      viewDate: currentViewDate(),
      panel: currentPanel(),
      granularity: granularity(),
      weekStartsOn: weekStartsOn(),
      ...(local.today ? { today: local.today } : {}),
      ...(local.min ? { min: local.min } : {}),
      ...(local.max ? { max: local.max } : {}),
      ...(local.disabledDate ? { disabledDate: local.disabledDate } : {}),
      ...(currentValue() ? { value: currentValue() } : {}),
      ...(local.values ? { values: local.values } : {}),
      ...(local.range ? { range: local.range } : {}),
    }),
  )

  function setViewDate(viewDate: CalendarDate) {
    if (local.viewDate === undefined) setInternalViewDate(() => viewDate)
    local.onViewDateChange?.(viewDate)
  }

  function setPanel(panel: CalendarPanel) {
    if (local.panel === undefined) setInternalPanel(panel)
    local.onPanelChange?.(panel)
  }

  return (
    <CalendarContext.Provider
      value={{
        grid,
        value: currentValue,
        viewDate: currentViewDate,
        panel: currentPanel,
        granularity,
        weekStartsOn,
        hoveredRowIndex,
        setViewDate,
        setPanel,
        selectCell: (cell) => {
          if (cell.state.disabled) return
          local.onCellSelect?.(cell as CoreCalendarCell<TValue>)
          if (local.value === undefined) setInternalValue(() => cell.value as TValue)
          local.onValueChange?.(cell.value as TValue)
        },
        hoverCell: (cell) => {
          if (cell.state.disabled) return
          setHoveredRowIndex(cell.rowIndex)
          local.onCellHover?.(cell as CoreCalendarCell<TValue>)
        },
        clearHoveredRow: () => setHoveredRowIndex(null),
      }}
    >
      <div
        {...rest}
        data-slot="calendar-root"
        data-panel={currentPanel()}
        data-granularity={granularity()}
        onMouseLeave={(event) => {
          if (typeof rest.onMouseLeave === 'function') rest.onMouseLeave(event)
          if (!event.defaultPrevented) setHoveredRowIndex(null)
        }}
      >
        {local.children}
      </div>
    </CalendarContext.Provider>
  )
}

export interface CalendarHeaderProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: (context: {
    viewDate: CalendarDate
    panel: CalendarPanel
    granularity: CalendarGranularity
    previousYear: () => void
    previousMonth: () => void
    nextMonth: () => void
    nextYear: () => void
    setPanel: (panel: CalendarPanel) => void
  }) => JSX.Element
}

export function CalendarHeader(props: CalendarHeaderProps) {
  const [local, rest] = splitProps(props, ['children'])
  const context = useCalendarContext('CalendarHeader')

  return (
    <div {...rest} data-slot="calendar-header">
      {local.children({
        viewDate: context.viewDate(),
        panel: context.panel(),
        granularity: context.granularity(),
        previousYear: () => context.setViewDate(subtractDate(context.viewDate(), { years: 1 })),
        previousMonth: () => context.setViewDate(subtractDate(context.viewDate(), { months: 1 })),
        nextMonth: () => context.setViewDate(addDate(context.viewDate(), { months: 1 })),
        nextYear: () => context.setViewDate(addDate(context.viewDate(), { years: 1 })),
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

export interface CalendarNavigationButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  action: CalendarNavigationAction
}

export function CalendarNavigationButton(props: ParentProps<CalendarNavigationButtonProps>) {
  const [local, rest] = splitProps(props, ['action', 'onClick', 'children'])
  const context = useCalendarContext('CalendarNavigationButton')

  function runAction() {
    if (local.action === 'previous-year')
      context.setViewDate(subtractDate(context.viewDate(), { years: 1 }))
    if (local.action === 'previous-month')
      context.setViewDate(subtractDate(context.viewDate(), { months: 1 }))
    if (local.action === 'next-month')
      context.setViewDate(addDate(context.viewDate(), { months: 1 }))
    if (local.action === 'next-year') context.setViewDate(addDate(context.viewDate(), { years: 1 }))
    if (local.action === 'previous-panel')
      context.setViewDate(
        context.panel() === 'date'
          ? subtractDate(context.viewDate(), { months: 1 })
          : subtractDate(context.viewDate(), { years: 1 }),
      )
    if (local.action === 'next-panel')
      context.setViewDate(
        context.panel() === 'date'
          ? addDate(context.viewDate(), { months: 1 })
          : addDate(context.viewDate(), { years: 1 }),
      )
  }

  return (
    <button
      {...rest}
      type="button"
      data-slot="calendar-navigation-button"
      data-action={local.action}
      onClick={(event) => {
        if (typeof local.onClick === 'function') local.onClick(event)
        if (event.defaultPrevented) return
        runAction()
      }}
    >
      {local.children}
    </button>
  )
}

export function CalendarWeekHeader(
  props: JSX.HTMLAttributes<HTMLDivElement> & { labels?: readonly string[] },
) {
  const [local, rest] = splitProps(props, ['labels'])
  const context = useCalendarContext('CalendarWeekHeader')
  const labels = () => local.labels ?? ['日', '一', '二', '三', '四', '五', '六']
  const orderedLabels = () =>
    labels().map((_, index) => labels()[(index + context.weekStartsOn()) % 7] ?? '')

  return (
    <div {...rest} data-slot="calendar-week-header">
      <For each={orderedLabels()}>
        {(label) => <div data-slot="calendar-week-head">{label}</div>}
      </For>
    </div>
  )
}

export interface CalendarGridProps<TValue extends CalendarValue = CalendarValue> extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  cellClass?: string
  children?: (cell: CalendarCellModel<TValue>) => JSX.Element
}

export function CalendarGrid<TValue extends CalendarValue = CalendarValue>(
  props: CalendarGridProps<TValue>,
) {
  const [local, rest] = splitProps(props, ['children', 'cellClass'])
  const context = useCalendarContext('CalendarGrid')

  return (
    <div
      {...rest}
      data-slot="calendar-grid"
      data-panel={context.panel()}
      onMouseLeave={(event) => {
        if (typeof rest.onMouseLeave === 'function') rest.onMouseLeave(event)
        if (!event.defaultPrevented) context.clearHoveredRow()
      }}
    >
      <Index each={context.grid().rows}>
        {(row) => (
          <div data-slot="calendar-row">
            <Index each={row()}>
              {(cell) =>
                local.children ? (
                  local.children(cell() as CalendarCellModel<TValue>)
                ) : (
                  <CalendarCell
                    cell={cell as Accessor<CalendarCellModel<TValue>>}
                    class={local.cellClass}
                  />
                )
              }
            </Index>
          </div>
        )}
      </Index>
    </div>
  )
}

export interface CalendarCellProps<TValue extends CalendarValue = CalendarValue> extends Omit<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'value'
> {
  cell: CalendarCellModel<TValue> | Accessor<CalendarCellModel<TValue>>
  children?: JSX.Element | ((cell: CalendarCellModel<TValue>) => JSX.Element)
}

export function CalendarCell<TValue extends CalendarValue = CalendarValue>(
  props: CalendarCellProps<TValue>,
) {
  const [local, rest] = splitProps(props, ['cell', 'children', 'class', 'onClick'])
  const context = useCalendarContext('CalendarCell')
  const cell = () =>
    typeof local.cell === 'function'
      ? (local.cell as Accessor<CalendarCellModel<TValue>>)()
      : local.cell

  return (
    <button
      {...rest}
      type="button"
      data-slot="calendar-cell"
      data-today={cell().state.today ? 'true' : undefined}
      data-outside={cell().state.outside ? 'true' : undefined}
      data-selected={cell().state.selected ? 'true' : undefined}
      data-range-start={
        cell().granularity !== 'week' && cell().state.rangeStart ? 'true' : undefined
      }
      data-range-end={cell().granularity !== 'week' && cell().state.rangeEnd ? 'true' : undefined}
      data-in-range={cell().granularity !== 'week' && cell().state.inRange ? 'true' : undefined}
      data-week-selected={
        cell().granularity === 'week' && cell().state.selected ? 'true' : undefined
      }
      data-week-hover={
        cell().granularity === 'week' && context.hoveredRowIndex() === cell().rowIndex
          ? 'true'
          : undefined
      }
      data-week-row-start={
        cell().granularity === 'week' && cell().columnIndex === 0 ? 'true' : undefined
      }
      data-week-row-end={
        cell().granularity === 'week' && cell().columnIndex === 6 ? 'true' : undefined
      }
      data-week-start={
        cell().granularity === 'week' && cell().state.selected && cell().columnIndex === 0
          ? 'true'
          : undefined
      }
      data-week-end={
        cell().granularity === 'week' && cell().state.selected && cell().columnIndex === 6
          ? 'true'
          : undefined
      }
      data-week-range-start={
        cell().granularity === 'week' && cell().state.rangeStart && !cell().state.rangeEnd
          ? 'true'
          : undefined
      }
      data-week-range-end={
        cell().granularity === 'week' && cell().state.rangeEnd && !cell().state.rangeStart
          ? 'true'
          : undefined
      }
      data-week-range-single={
        cell().granularity === 'week' && cell().state.rangeStart && cell().state.rangeEnd
          ? 'true'
          : undefined
      }
      data-week-in-range={
        cell().granularity === 'week' && cell().state.inRange ? 'true' : undefined
      }
      data-week-range={
        cell().granularity === 'week' &&
        (cell().state.rangeStart || cell().state.rangeEnd || cell().state.inRange)
          ? 'true'
          : undefined
      }
      data-disabled={cell().state.disabled ? 'true' : undefined}
      disabled={cell().state.disabled}
      class={cn(local.class)}
      on:click={(event) => {
        if (typeof local.onClick === 'function') local.onClick(event)
        if (event.defaultPrevented) return
        context.selectCell(cell())
      }}
      onMouseEnter={(event) => {
        if (typeof rest.onMouseEnter === 'function') rest.onMouseEnter(event)
        if (!event.defaultPrevented) context.hoverCell(cell())
      }}
    >
      {typeof local.children === 'function'
        ? local.children(cell())
        : (local.children ?? cell().label)}
    </button>
  )
}
