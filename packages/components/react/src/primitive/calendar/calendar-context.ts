import type {
  CalendarCell,
  CalendarDate,
  CalendarGranularity,
  CalendarGrid,
  CalendarPanel,
  CalendarValue,
  CalendarWeekday,
} from '@fex/components-core/calendar'
import { createContext, use } from 'react'

export interface CalendarContextValue<TValue extends CalendarValue = CalendarValue> {
  grid: CalendarGrid<TValue>
  value: TValue | null
  viewDate: CalendarDate
  panel: CalendarPanel
  granularity: CalendarGranularity
  weekStartsOn: CalendarWeekday
  setViewDate: (viewDate: CalendarDate) => void
  setPanel: (panel: CalendarPanel) => void
  selectCell: (cell: CalendarCell<TValue>) => void
}

export const CalendarContext = createContext<CalendarContextValue | null>(null)

export function useCalendarContext(componentName: string): CalendarContextValue {
  const context = use(CalendarContext)
  if (!context) {
    throw new Error(`${componentName} must be used within CalendarRoot`)
  }
  return context
}
