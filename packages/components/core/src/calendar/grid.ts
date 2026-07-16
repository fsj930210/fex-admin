import {
  Temporal,
  compareCalendarDate,
  getCalendarDateKey,
  getDayIndex,
  getMonthStart,
} from './temporal'
import {
  getCalendarValueDate,
  getCalendarValueLabel,
  isSameCalendarValue,
} from './value'
import { isCalendarValueInRange } from './range'
import type {
  CalendarCell,
  CalendarDate,
  CalendarGranularity,
  CalendarGrid,
  CalendarGridOptions,
  CalendarPanel,
  CalendarQuarter,
  CalendarValue,
  CalendarWeek,
} from './types'

const dateColumnCount = 7
const panelColumnCount = 4

export function createCalendarGrid<TValue extends CalendarValue = CalendarValue>(
  options: CalendarGridOptions<TValue>,
): CalendarGrid<TValue> {
  const today = options.today ?? Temporal.Now.plainDateISO()

  if (options.panel === 'date') {
    return createDatePanelGrid({ ...options, today })
  }

  return createUnitPanelGrid({ ...options, today })
}

function createDatePanelGrid<TValue extends CalendarValue>(
  options: CalendarGridOptions<TValue> & { today: CalendarDate },
): CalendarGrid<TValue> {
  const monthStart = getMonthStart(options.viewDate)
  const weekStartsOn = options.weekStartsOn ?? 0
  // Date panels always render a stable 6 x 7 matrix so popovers and range panels do
  // not change size when users move between months.
  const leadingDayCount =
    (getDayIndex(monthStart) - weekStartsOn + dateColumnCount) % dateColumnCount
  const firstCellDate = monthStart.subtract({ days: leadingDayCount })
  const cells = Array.from({ length: 42 }, (_, index) => {
    const date = firstCellDate.add({ days: index })
    const value = getDateCellValue(date, options.granularity, weekStartsOn)
    return createCalendarCell({
      date,
      value,
      panel: options.panel,
      granularity: options.granularity,
      rowIndex: Math.floor(index / dateColumnCount),
      columnIndex: index % dateColumnCount,
      outside: date.month !== options.viewDate.month,
      options,
    })
  })

  return {
    panel: options.panel,
    granularity: options.granularity,
    viewDate: options.viewDate,
    rows: chunkCells(cells, dateColumnCount),
  }
}

function createUnitPanelGrid<TValue extends CalendarValue>(
  options: CalendarGridOptions<TValue> & { today: CalendarDate },
): CalendarGrid<TValue> {
  // Unit panels share the same cell contract as dates: each cell has a semantic
  // value plus a representative PlainDate for ordering and disabled checks.
  const values = getPanelValues(options.viewDate, options.panel)
  const cells = values.map((value, index) => {
    const date = getCalendarValueDate(value)
    return createCalendarCell({
      date,
      value,
      panel: options.panel,
      granularity: getPanelGranularity(options.panel),
      rowIndex: Math.floor(index / panelColumnCount),
      columnIndex: index % panelColumnCount,
      outside: isOutsideUnitPanel(value, options.viewDate, options.panel),
      options,
    })
  })

  return {
    panel: options.panel,
    granularity: options.granularity,
    viewDate: options.viewDate,
    rows: chunkCells(cells, panelColumnCount),
  }
}

function createCalendarCell<TValue extends CalendarValue>({
  date,
  value,
  panel,
  granularity,
  rowIndex,
  columnIndex,
  outside,
  options,
}: {
  date: CalendarDate
  value: CalendarValue
  panel: CalendarPanel
  granularity: CalendarGranularity
  rowIndex: number
  columnIndex: number
  outside: boolean
  options: CalendarGridOptions<TValue> & { today: CalendarDate }
}): CalendarCell<TValue> {
  const isBeforeMin = options.min ? compareCalendarDate(date, options.min) < 0 : false
  const isAfterMax = options.max ? compareCalendarDate(date, options.max) > 0 : false
  const disabled = isBeforeMin || isAfterMax || Boolean(options.disabledDate?.(date))

  return {
    key: `${panel}:${granularity}:${getCalendarDateKey(date)}:${rowIndex}:${columnIndex}`,
    value: value as TValue,
    date,
    panel,
    granularity,
    label: panel === 'date' ? String(date.day) : getCalendarValueLabel(value, granularity),
    rowIndex,
    columnIndex,
    state: {
      today: getCalendarDateKey(date) === getCalendarDateKey(options.today),
      outside,
      disabled,
      selected: isSameCalendarValue(value, options.value),
      rangeStart: isSameCalendarValue(value, options.range?.start),
      rangeEnd: isSameCalendarValue(value, options.range?.end),
      inRange: isCalendarValueInRange(value, options.range),
    },
  }
}

function getDateCellValue(
  date: CalendarDate,
  granularity: CalendarGranularity,
  weekStartsOn: number,
): CalendarValue {
  if (granularity === 'week') {
    // Week values are explicit ranges, not a single date standing in for the week.
    const offset = (getDayIndex(date) - weekStartsOn + dateColumnCount) % dateColumnCount
    const start = date.subtract({ days: offset })
    return { start, end: start.add({ days: 6 }) } satisfies CalendarWeek
  }

  return date
}

function getPanelValues(viewDate: CalendarDate, panel: CalendarPanel): CalendarValue[] {
  if (panel === 'month') {
    return Array.from({ length: 12 }, (_, index) =>
      Temporal.PlainYearMonth.from({ year: viewDate.year, month: index + 1 }),
    )
  }

  if (panel === 'quarter') {
    return [1, 2, 3, 4].map((quarter) => ({ year: viewDate.year, quarter })) as CalendarQuarter[]
  }

  const startYear = panel === 'decade' ? Math.floor(viewDate.year / 10) * 10 - 1 : viewDate.year - 5
  return Array.from({ length: 12 }, (_, index) => ({ year: startYear + index }))
}

function getPanelGranularity(panel: CalendarPanel): CalendarGranularity {
  if (panel === 'month') return 'month'
  if (panel === 'quarter') return 'quarter'
  return 'year'
}

function isOutsideUnitPanel(
  value: CalendarValue,
  viewDate: CalendarDate,
  panel: CalendarPanel,
): boolean {
  if (panel === 'decade') {
    const year = getCalendarValueDate(value).year
    const decadeStart = Math.floor(viewDate.year / 10) * 10
    return year < decadeStart || year > decadeStart + 9
  }

  return false
}

function chunkCells<TValue extends CalendarValue>(
  cells: CalendarCell<TValue>[],
  columnCount: number,
): CalendarCell<TValue>[][] {
  return Array.from({ length: Math.ceil(cells.length / columnCount) }, (_, rowIndex) =>
    cells.slice(rowIndex * columnCount, rowIndex * columnCount + columnCount),
  )
}
