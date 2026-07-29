import type {
  CalendarCell,
  CalendarDate,
  CalendarGranularity,
  CalendarGrid,
  CalendarPanel,
  CalendarValue,
  CalendarWeekday,
} from '@fex/components-core/calendar'
import { createContext, useContext, type Accessor } from 'solid-js'

export interface CalendarContextValue<TValue extends CalendarValue = CalendarValue> {
  grid: Accessor<CalendarGrid<TValue>>
  value: Accessor<TValue | null>
  viewDate: Accessor<CalendarDate>
  panel: Accessor<CalendarPanel>
  granularity: Accessor<CalendarGranularity>
  weekStartsOn: Accessor<CalendarWeekday>
  hoveredRowIndex: Accessor<number | null>
  setViewDate: (viewDate: CalendarDate) => void
  setPanel: (panel: CalendarPanel) => void
  selectCell: (cell: CalendarCell<TValue>) => void
  hoverCell: (cell: CalendarCell<TValue>) => void
  clearHoveredRow: () => void
}

export const CalendarContext = createContext<CalendarContextValue>()

export function useCalendarContext(componentName: string): CalendarContextValue {
  const context = useContext(CalendarContext)
  if (!context) throw new Error(`${componentName} must be used within CalendarRoot`)
  return context
}
