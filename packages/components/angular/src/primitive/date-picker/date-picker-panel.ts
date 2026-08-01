import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import {
  getCalendarValueDate,
  type CalendarCell,
  type CalendarDate,
  type CalendarPanel,
  type CalendarValue,
} from '@fex/components-core/calendar'
import {
  getDefaultPanelByPicker,
  getGranularityByPicker,
} from '@fex/components-core/date-picker/panel'
import { createRangePreviewValue } from '@fex/components-core/date-picker/range'
import { normalizeDatePickerValue } from '@fex/components-core/date-picker/value'
import {
  datePickerCellClassName,
  datePickerGridClassName,
  datePickerHeaderSideClassName,
  datePickerPanelClassName,
  datePickerWeekHeaderClassName,
} from '@fex/components-styles/date-picker'
import {
  CalendarCellButton,
  CalendarGrid,
  CalendarRoot,
  CalendarWeekHeader,
} from '../calendar/calendar'
import {
  DatePickerHeader,
  DatePickerHeaderButton,
  DatePickerHeaderLabel,
  DatePickerHeaderTitle,
} from './date-picker-header'
import { DatePickerState } from './use-date-picker'
import { RangePickerState } from './use-range-picker'

function getNextPanelAfterCell(panel: CalendarPanel, picker: string): CalendarPanel | null {
  if (picker === 'year') return null
  if (panel === 'decade') return 'year'
  if (panel === 'year')
    return picker === 'month' || picker === 'quarter'
      ? getDefaultPanelByPicker(picker as 'month' | 'quarter')
      : 'month'
  if (panel === 'month') return picker === 'month' ? null : 'date'
  if (panel === 'quarter') return null
  return null
}

@Component({
  selector: 'fex-date-picker-panel',
  standalone: true,
  imports: [
    CalendarRoot,
    CalendarWeekHeader,
    CalendarGrid,
    CalendarCellButton,
    DatePickerHeader,
    DatePickerHeaderButton,
    DatePickerHeaderLabel,
    DatePickerHeaderTitle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './date-picker-panel.html',
})
export class DatePickerPanel {
  protected readonly panelClassName = datePickerPanelClassName
  protected readonly headerSideClassName = datePickerHeaderSideClassName
  protected readonly weekHeaderClassName = datePickerWeekHeaderClassName
  protected readonly gridClassName = datePickerGridClassName
  protected readonly cellClassName = datePickerCellClassName
  protected readonly getGranularityByPicker = getGranularityByPicker

  constructor(readonly state: DatePickerState) {}

  selectCell(cell: CalendarCell) {
    const context = this.state.context()
    const nextPanel = getNextPanelAfterCell(cell.panel, context.picker)
    const nextViewDate = getCalendarValueDate(cell.value)
    if (nextPanel) {
      context.setViewDate(nextViewDate)
      context.setPanel(nextPanel)
      return
    }
    context.select(normalizeDatePickerValue(nextViewDate, context.picker, context.weekStartsOn))
  }

  primaryPreviousAction() {
    return this.state.context().panel === 'date' ? 'previous-year' : 'previous-panel'
  }

  primaryNextAction() {
    return this.state.context().panel === 'date' ? 'next-year' : 'next-panel'
  }
}

@Component({
  selector: 'fex-range-picker-panel',
  standalone: true,
  imports: [
    CalendarRoot,
    CalendarWeekHeader,
    CalendarGrid,
    CalendarCellButton,
    DatePickerHeader,
    DatePickerHeaderButton,
    DatePickerHeaderLabel,
    DatePickerHeaderTitle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './range-picker-panel.html',
})
export class RangePickerPanel {
  @Input() panelViewDate?: CalendarDate
  protected readonly panelClassName = datePickerPanelClassName
  protected readonly headerSideClassName = datePickerHeaderSideClassName
  protected readonly weekHeaderClassName = datePickerWeekHeaderClassName
  protected readonly gridClassName = datePickerGridClassName
  protected readonly cellClassName = datePickerCellClassName
  protected readonly getGranularityByPicker = getGranularityByPicker

  constructor(readonly state: RangePickerState) {}

  viewDate() {
    return this.panelViewDate ?? this.state.context().viewDate
  }

  displayRange() {
    const context = this.state.context()
    return createRangePreviewValue(
      context.rangeValue,
      context.hoverValue as CalendarValue | null,
      context.activePart,
    )
  }

  selectCell(cell: CalendarCell) {
    const context = this.state.context()
    const nextPanel = getNextPanelAfterCell(cell.panel, context.picker)
    const nextViewDate = getCalendarValueDate(cell.value)
    if (nextPanel) {
      context.setViewDate(nextViewDate)
      context.setPanel(nextPanel)
      return
    }
    context.select(normalizeDatePickerValue(nextViewDate, context.picker, context.weekStartsOn))
  }

  hoverCell(cell: CalendarCell) {
    if (!cell.state.disabled) this.state.setHoverValue(cell.value)
  }

  disabledDate(date: CalendarDate) {
    const context = this.state.context()
    return context.disabledDate?.(date, context.activePart) ?? false
  }

  primaryPreviousAction() {
    return this.state.context().panel === 'date' ? 'previous-year' : 'previous-panel'
  }

  primaryNextAction() {
    return this.state.context().panel === 'date' ? 'next-year' : 'next-panel'
  }
}
