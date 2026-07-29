import type {
  CalendarCell,
  CalendarDate,
  CalendarGranularity,
  CalendarGrid,
  CalendarPanel,
  CalendarValue,
  CalendarWeekday,
} from '@fex/components-core/calendar'

export const calendarContextKey = Symbol('CalendarContext')

export interface CalendarContextValue<TValue extends CalendarValue = CalendarValue> {
  getGrid: () => CalendarGrid<TValue>
  getValue: () => TValue | null
  getViewDate: () => CalendarDate
  getPanel: () => CalendarPanel
  getGranularity: () => CalendarGranularity
  getWeekStartsOn: () => CalendarWeekday
  getHoveredRowIndex: () => number | null
  setViewDate: (viewDate: CalendarDate) => void
  setPanel: (panel: CalendarPanel) => void
  selectCell: (cell: CalendarCell<TValue>) => void
  hoverCell: (cell: CalendarCell<TValue>) => void
  clearHoveredRow: () => void
}
