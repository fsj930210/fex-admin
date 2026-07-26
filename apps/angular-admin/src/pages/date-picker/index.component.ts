import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { createCalendarDate, getCalendarValueDate, getCalendarValueKey, type CalendarDate, type CalendarRange, type CalendarValue } from '@fex/components-core/calendar'
import { isAfterDate, isBeforeDate } from '@fex/components-core/date/utils'
import { Card } from '@fex/components-angular/ui/card'
import { Button } from '@fex/components-angular/ui/button'
import {
  DatePicker,
  RangePicker,
} from '@fex/components-angular/primitive/date-picker'
import { TimePickerRoot, TimePickerTrigger } from '@fex/components-angular/primitive/time-picker'

@Component({
  selector: 'fex-date-picker-page',
  standalone: true,
  imports: [RouterLink, Card, Button, DatePicker, RangePicker, TimePickerRoot, TimePickerTrigger],
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent {
  protected readonly today = createCalendarDate(2026, 7, 26)
  protected readonly value = signal<CalendarValue | null>(this.today)
  protected readonly multiple = signal<CalendarValue[]>([])
  protected readonly controlled = signal<CalendarValue | null>(this.today)
  protected readonly range = signal<CalendarRange<CalendarValue>>({})
  protected readonly submitted = signal<CalendarRange<CalendarValue>>({})
  protected readonly panelValue = signal<CalendarValue | null>(null)
  protected readonly open = signal(false)
  protected readonly submitCount = signal(0)
  protected readonly getCalendarValueKey = getCalendarValueKey
  protected readonly disabledWeekend = (date: CalendarDate) => date.dayOfWeek === 6

  protected toggle(next: CalendarValue) {
    this.multiple.update((current) =>
      current.some((item) => getCalendarValueKey(item) === getCalendarValueKey(next))
        ? current.filter((item) => getCalendarValueKey(item) !== getCalendarValueKey(next))
        : [...current, next],
    )
  }

  protected setMultiple(next: CalendarValue | readonly CalendarValue[] | null) {
    this.multiple.set(Array.isArray(next) ? [...next] : [])
  }

  protected setControlled(next: CalendarValue | readonly CalendarValue[] | null) {
    this.controlled.set(Array.isArray(next) ? null : next as CalendarValue | null)
  }

  protected setValue(next: CalendarValue | readonly CalendarValue[] | null) {
    this.value.set(Array.isArray(next) ? null : next as CalendarValue | null)
  }

  protected setPanelValue(next: CalendarValue | readonly CalendarValue[] | null) {
    this.panelValue.set(Array.isArray(next) ? null : next as CalendarValue | null)
  }

  protected readonly dynamicDisabled = (date: CalendarDate, part: 'start' | 'end') => {
    const from = part === 'end' ? this.range().start : this.range().end
    if (!from) return false
    const fromDate = getCalendarValueDate(from)
    return isBeforeDate(date, fromDate.subtract({ days: 6 })) || isAfterDate(date, fromDate.add({ days: 6 }))
  }

  protected lastDays(days: number): CalendarRange<CalendarValue> {
    return { start: this.today.subtract({ days: days - 1 }), end: this.today }
  }

  protected incrementSubmitCount() {
    this.submitCount.update((count) => count + 1)
  }
}
