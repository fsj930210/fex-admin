import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import type { CalendarValue } from '@fex/components-core/calendar'
import { formatDatePickerValue } from '@fex/components-core/date-picker/value'
import {
  datePickerMultipleTagsClassName,
  datePickerTagClassName,
  datePickerTagOverflowClassName,
  datePickerTagRemoveClassName,
} from '@fex/components-styles/date-picker'
import { CloseIcon } from '../../icon/close'
import { createHostClassName } from '../../signals/host-class'
import { DatePickerState } from './use-date-picker'

@Component({
  selector: 'fex-date-picker-tags',
  standalone: true,
  imports: [CloseIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'date-picker-tags',
    '[class]': 'hostClassName()',
  },
  templateUrl: './date-picker-tags.html',
})
export class DatePickerTags {
  @Input() maxTagCount = 1
  protected readonly hostClassName = createHostClassName(datePickerMultipleTagsClassName)
  protected readonly tagClassName = datePickerTagClassName
  protected readonly tagRemoveClassName = datePickerTagRemoveClassName
  protected readonly tagOverflowClassName = datePickerTagOverflowClassName

  constructor(readonly state: DatePickerState) {}

  visibleValues() {
    return this.state.calendarValues().slice(0, this.maxTagCount)
  }

  overflowCount() {
    return Math.max(this.state.calendarValues().length - this.maxTagCount, 0)
  }

  label(value: CalendarValue) {
    const context = this.state.context()
    return formatDatePickerValue(value, context)
  }

  remove(value: CalendarValue, event: Event) {
    event.preventDefault()
    event.stopPropagation()
    this.state.select(value)
  }
}
