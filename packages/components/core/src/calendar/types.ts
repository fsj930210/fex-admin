export interface CalendarDate {
  readonly year: number
  readonly month: number
  readonly day: number
  readonly dayOfWeek: number
  readonly calendarId: string
  add(duration: { days?: number; weeks?: number; months?: number; years?: number }): CalendarDate
  subtract(duration: {
    days?: number
    weeks?: number
    months?: number
    years?: number
  }): CalendarDate
  with(fields: { day?: number; month?: number; year?: number }): CalendarDate
  toString(): string
}

export interface CalendarYearMonth {
  readonly year: number
  readonly month: number
  toPlainDate(fields: { day: number }): CalendarDate
  toString(): string
}

export type CalendarGranularity = 'date' | 'week' | 'month' | 'quarter' | 'year'
export type CalendarPanel = 'date' | 'month' | 'quarter' | 'year' | 'decade'

export interface CalendarWeek {
  start: CalendarDate
  end: CalendarDate
}

export interface CalendarQuarter {
  year: number
  quarter: 1 | 2 | 3 | 4
}

export interface CalendarYear {
  year: number
}

export type CalendarValue =
  | CalendarDate
  | CalendarWeek
  | CalendarYearMonth
  | CalendarQuarter
  | CalendarYear

export interface CalendarRange<TValue extends CalendarValue = CalendarValue> {
  start?: TValue
  end?: TValue
}

export type CalendarWeekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface CalendarCellState {
  today: boolean
  outside: boolean
  disabled: boolean
  selected: boolean
  rangeStart: boolean
  rangeEnd: boolean
  inRange: boolean
}

export interface CalendarCell<TValue extends CalendarValue = CalendarValue> {
  key: string
  value: TValue
  date: CalendarDate
  panel: CalendarPanel
  granularity: CalendarGranularity
  label: string
  rowIndex: number
  columnIndex: number
  state: CalendarCellState
}

export interface CalendarGrid<TValue extends CalendarValue = CalendarValue> {
  panel: CalendarPanel
  granularity: CalendarGranularity
  viewDate: CalendarDate
  rows: CalendarCell<TValue>[][]
}

export interface CalendarGridOptions<TValue extends CalendarValue = CalendarValue> {
  viewDate: CalendarDate
  panel: CalendarPanel
  granularity: CalendarGranularity
  today?: CalendarDate
  value?: TValue | null
  range?: CalendarRange<TValue>
  weekStartsOn?: CalendarWeekday
  min?: CalendarDate
  max?: CalendarDate
  disabledDate?: (date: CalendarDate) => boolean
}
