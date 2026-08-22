import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
  createCalendarDate,
  getCalendarValueDate,
  getCalendarValueKey,
  type CalendarDate,
  type CalendarRange,
  type CalendarValue,
} from '@fex-design/core/calendar'
import { isAfterDate, isBeforeDate } from '@fex-design/core/date/utils'
import { Card } from '@fex-design/angular/ui/card'
import { Button } from '@fex-design/angular/ui/button'
import { DemoDatePicker, DemoRangePicker } from './demo-date-picker.component'
import { CustomDemos } from './custom-demos.component'
import { IntegrationDemos } from './integration-demos.component'
import { StatusDemos } from './status-demos.component'

@Component({
  selector: 'fex-date-picker-page',
  standalone: true,
  imports: [
    RouterLink,
    Card,
    Button,
    DemoDatePicker,
    DemoRangePicker,
    CustomDemos,
    IntegrationDemos,
    StatusDemos,
  ],
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent {
  protected readonly today = createCalendarDate(2026, 7, 26)
  protected readonly value = signal<CalendarValue | null>(this.today)
  protected readonly multiple = signal<CalendarValue[]>([])
  protected readonly controlled = signal<CalendarValue | null>(this.today)
  protected readonly range = signal<CalendarRange<CalendarValue>>({})
  protected readonly dynamicRange = signal<CalendarRange<CalendarValue>>(this.lastDays(7))
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
    this.controlled.set(Array.isArray(next) ? null : (next as CalendarValue | null))
  }

  protected setValue(next: CalendarValue | readonly CalendarValue[] | null) {
    this.value.set(Array.isArray(next) ? null : (next as CalendarValue | null))
  }

  protected setPanelValue(next: CalendarValue | readonly CalendarValue[] | null) {
    this.panelValue.set(Array.isArray(next) ? null : (next as CalendarValue | null))
  }

  protected readonly dynamicDisabled = (date: CalendarDate, part: 'start' | 'end') => {
    if (part === 'start') {
      const end = this.dynamicRange().end
      if (!end) return false
      const endDate = getCalendarValueDate(end)
      return isBeforeDate(date, endDate.subtract({ days: 6 })) || isAfterDate(date, endDate)
    }
    const start = this.dynamicRange().start
    if (!start) return false
    const startDate = getCalendarValueDate(start)
    return isBeforeDate(date, startDate) || isAfterDate(date, startDate.add({ days: 6 }))
  }

  protected lastDays(days: number): CalendarRange<CalendarValue> {
    return { start: this.today.subtract({ days: days - 1 }), end: this.today }
  }

  protected incrementSubmitCount() {
    this.submitCount.update((count) => count + 1)
  }
}
