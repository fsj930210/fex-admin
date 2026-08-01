import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import type {
  CalendarDate,
  CalendarRange,
  CalendarValue,
  CalendarWeekday,
} from '@fex/components-core/calendar'
import type { DatePickerPicker } from '@fex/components-angular/primitive/date-picker'
import {
  DatePickerCancel,
  DatePickerConfirm,
  DatePickerContent,
  DatePickerFooter,
  DatePickerPanel,
  DatePickerRoot,
  DatePickerToday,
  DatePickerTrigger,
  RangePickerContent,
  RangePickerPanelGroup,
  RangePickerRoot,
  RangePickerTrigger,
  type DatePickerSelectionValue,
} from '@fex/components-angular/primitive/date-picker'

@Component({
  selector: 'demo-date-picker',
  standalone: true,
  imports: [
    DatePickerRoot,
    DatePickerTrigger,
    DatePickerContent,
    DatePickerPanel,
    DatePickerFooter,
    DatePickerToday,
    DatePickerCancel,
    DatePickerConfirm,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demo-date-picker.component.html',
})
export class DemoDatePicker {
  @Input() picker: DatePickerPicker | undefined = undefined
  @Input() status: 'error' | 'warning' | undefined = undefined
  @Input() value: DatePickerSelectionValue | undefined = undefined
  @Input() defaultValue: DatePickerSelectionValue | undefined = undefined
  @Input() open: boolean | undefined = undefined
  @Input() defaultOpen: boolean | undefined = undefined
  @Input() multiple: boolean | undefined = undefined
  @Input() needConfirm: boolean | undefined = undefined
  @Input() disabled: boolean | undefined = undefined
  @Input() readOnly: boolean | undefined = undefined
  @Input() allowClear: boolean | undefined = undefined
  @Input() format: string | undefined = undefined
  @Input() placeholder: string | undefined = undefined
  @Input() weekStartsOn: CalendarWeekday | undefined = undefined
  @Input() minDate: CalendarDate | undefined = undefined
  @Input() maxDate: CalendarDate | undefined = undefined
  @Input() disabledDate: ((date: CalendarDate) => boolean) | undefined = undefined
  @Output() readonly change = new EventEmitter<DatePickerSelectionValue>()
  @Output() readonly openChange = new EventEmitter<boolean>()
}

@Component({
  selector: 'demo-range-picker',
  standalone: true,
  imports: [
    RangePickerRoot,
    RangePickerTrigger,
    RangePickerContent,
    RangePickerPanelGroup,
    DatePickerFooter,
    DatePickerCancel,
    DatePickerConfirm,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demo-range-picker.component.html',
})
export class DemoRangePicker {
  @Input() picker: DatePickerPicker | undefined = undefined
  @Input() status: 'error' | 'warning' | undefined = undefined
  @Input() value: CalendarRange<CalendarValue> | undefined = undefined
  @Input() defaultValue: CalendarRange<CalendarValue> | undefined = undefined
  @Input() open: boolean | undefined = undefined
  @Input() defaultOpen: boolean | undefined = undefined
  @Input() needConfirm: boolean | undefined = undefined
  @Input() disabled: boolean | undefined = undefined
  @Input() readOnly: boolean | undefined = undefined
  @Input() allowClear: boolean | undefined = undefined
  @Input() allowEmpty: boolean | { start?: boolean; end?: boolean } | undefined = undefined
  @Input() order: boolean | undefined = undefined
  @Input() format: string | undefined = undefined
  @Input() weekStartsOn: CalendarWeekday | undefined = undefined
  @Input() minDate: CalendarDate | undefined = undefined
  @Input() maxDate: CalendarDate | undefined = undefined
  @Input() disabledDate:
    | ((date: CalendarDate, activePart: 'start' | 'end') => boolean)
    | undefined = undefined
  @Input() panelCount: 1 | 2 = 2
  @Output() readonly change = new EventEmitter<CalendarRange<CalendarValue>>()
  @Output() readonly openChange = new EventEmitter<boolean>()

  startPlaceholder() {
    if (this.picker === 'week') return '开始周'
    if (this.picker === 'month') return '开始月份'
    if (this.picker === 'quarter') return '开始季度'
    if (this.picker === 'year') return '开始年份'
    return '开始日期'
  }

  endPlaceholder() {
    if (this.picker === 'week') return '结束周'
    if (this.picker === 'month') return '结束月份'
    if (this.picker === 'quarter') return '结束季度'
    if (this.picker === 'year') return '结束年份'
    return '结束日期'
  }
}
