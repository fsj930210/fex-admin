import { addDate, subtractDate } from '../date/utils'
import type { CalendarDate, CalendarGranularity, CalendarPanel } from '../calendar/types'
import type { DatePickerHeaderAction, DatePickerHeaderLabelPart, DatePickerPicker } from './types'

export function getDefaultPanelByPicker(picker: DatePickerPicker): CalendarPanel {
  if (picker === 'month') return 'month'
  if (picker === 'quarter') return 'quarter'
  if (picker === 'year') return 'decade'
  return 'date'
}

export function getGranularityByPicker(picker: DatePickerPicker): CalendarGranularity {
  return picker
}

export function getNextPanelByHeaderLabel(part: DatePickerHeaderLabelPart): CalendarPanel {
  return part === 'year' ? 'decade' : 'month'
}

export function getDatePickerHeaderLabelParts(
  picker: DatePickerPicker,
  panel: CalendarPanel,
): DatePickerHeaderLabelPart[] {
  if (picker === 'year') return ['year']
  if (
    picker === 'quarter' ||
    panel === 'month' ||
    panel === 'quarter' ||
    panel === 'year' ||
    panel === 'decade'
  )
    return ['year']
  return ['year', 'month']
}

export function getNextViewDateByHeaderAction(
  viewDate: CalendarDate,
  action: DatePickerHeaderAction,
  panel: CalendarPanel,
): CalendarDate {
  if (action === 'previous-year') return subtractDate(viewDate, { years: 1 })
  if (action === 'next-year') return addDate(viewDate, { years: 1 })
  if (action === 'previous-month') return subtractDate(viewDate, { months: 1 })
  if (action === 'next-month') return addDate(viewDate, { months: 1 })
  if (panel === 'date') {
    return action === 'previous-panel'
      ? subtractDate(viewDate, { months: 1 })
      : addDate(viewDate, { months: 1 })
  }
  return action === 'previous-panel'
    ? subtractDate(viewDate, { years: panel === 'decade' || panel === 'year' ? 10 : 1 })
    : addDate(viewDate, { years: panel === 'decade' || panel === 'year' ? 10 : 1 })
}

export function getRangePanelViewDates(
  viewDate: CalendarDate,
  panel: CalendarPanel,
): [CalendarDate, CalendarDate] {
  if (panel === 'date') return [viewDate, addDate(viewDate, { months: 1 })]
  if (panel === 'month' || panel === 'quarter') return [viewDate, addDate(viewDate, { years: 1 })]
  if (panel === 'year') return [viewDate, addDate(viewDate, { years: 12 })]
  return [viewDate, addDate(viewDate, { years: 10 })]
}
