import type {
  CalendarCell,
  CalendarDate,
  CalendarGranularity,
  CalendarGrid,
  CalendarPanel,
  CalendarValue,
  CalendarWeekday,
} from '@fex-design/core/calendar'
import { inject, type InjectionKey, type Ref } from 'vue'

export interface CalendarContextValue<TValue extends CalendarValue = CalendarValue> {
  grid: Ref<CalendarGrid<TValue>>
  value: Ref<TValue | null>
  viewDate: Ref<CalendarDate>
  panel: Ref<CalendarPanel>
  granularity: Ref<CalendarGranularity>
  weekStartsOn: Ref<CalendarWeekday>
  hoveredRowIndex: Ref<number | null>
  setViewDate: (viewDate: CalendarDate) => void
  setPanel: (panel: CalendarPanel) => void
  selectCell: (cell: CalendarCell<TValue>) => void
  hoverCell: (cell: CalendarCell<TValue>) => void
  clearHoveredRow: () => void
}

export const calendarContextKey: InjectionKey<CalendarContextValue> = Symbol('CalendarContext')

export function useCalendarContext(componentName: string): CalendarContextValue {
  const context = inject(calendarContextKey)
  if (!context) throw new Error(`${componentName} must be used within CalendarRoot`)
  return context
}
