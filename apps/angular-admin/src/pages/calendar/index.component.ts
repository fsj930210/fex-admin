import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
  compareCalendarDate,
  createCalendarDate,
  getCalendarValueKey,
  type CalendarCell,
  type CalendarGranularity,
  type CalendarPanel,
  type CalendarValue,
} from '@fex/components-core/calendar'
import {
  CalendarCellButton,
  CalendarGrid,
  CalendarHeader,
  CalendarNavigationButton,
  CalendarRoot,
  CalendarWeekHeader,
} from '@fex/components-angular/primitive/calendar'
import Card from '@fex/components-angular/ui/card'

type UnitDemo = {
  title: string
  panel: Extract<CalendarPanel, 'month' | 'quarter' | 'year'>
  granularity: Extract<CalendarGranularity, 'month' | 'quarter' | 'year'>
}

@Component({
  selector: 'fex-calendar-page',
  imports: [
    CalendarCellButton,
    CalendarGrid,
    CalendarHeader,
    CalendarNavigationButton,
    CalendarRoot,
    CalendarWeekHeader,
    Card,
    RouterLink,
  ],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  protected readonly july = createCalendarDate(2026, 7, 1)
  protected readonly today = createCalendarDate(2026, 7, 11)
  protected readonly minDate = createCalendarDate(2026, 7, 5)
  protected readonly maxDate = createCalendarDate(2026, 7, 24)
  protected readonly minYearPanelDate = createCalendarDate(2024, 1, 1)
  protected readonly scheduleMap = new Map([
    ['date:2026-07-08', '评审'],
    ['date:2026-07-11', '发布'],
    ['date:2026-07-18', '值班'],
  ])
  protected readonly unitDemos: UnitDemo[] = [
    { title: 'Month', panel: 'month', granularity: 'month' },
    { title: 'Quarter', panel: 'quarter', granularity: 'quarter' },
    { title: 'Year', panel: 'year', granularity: 'year' },
  ]

  protected readonly dateValue = signal<CalendarValue | null>(this.today)
  protected readonly weekValue = signal<CalendarValue | null>(null)
  protected readonly monthValue = signal<CalendarValue | null>(null)
  protected readonly quarterValue = signal<CalendarValue | null>(null)
  protected readonly yearValue = signal<CalendarValue | null>(null)

  protected getCalendarValueKey = getCalendarValueKey

  protected getCellClassName(cell: CalendarCell) {
    return [
      'flex min-h-14 items-center justify-center rounded-md p-space-xs text-center text-sm',
      cell.state.disabled ? 'cursor-not-allowed opacity-40' : '',
      cell.state.outside && !cell.state.selected ? 'text-muted-foreground' : 'text-foreground',
    ].join(' ')
  }

  protected getContentClassName(cell: CalendarCell) {
    return [
      'inline-flex h-16 w-20 flex-col items-center justify-center rounded-md border px-space-sm py-space-xs transition-colors',
      cell.state.selected ? 'bg-foreground text-background shadow-sm' : '',
      cell.state.today && !cell.state.selected ? 'border-primary' : 'border-transparent',
      !cell.state.disabled && !cell.state.selected ? 'hover:bg-muted-background' : '',
    ].join(' ')
  }

  protected getDateLabelClassName(cell: CalendarCell) {
    return 'font-medium'
  }

  protected getScheduleLabel(cell: CalendarCell) {
    return this.scheduleMap.get(this.getCalendarValueKey(cell.value))
  }

  protected isYearDisabled = (date: ReturnType<typeof createCalendarDate>) =>
    compareCalendarDate(date, this.minYearPanelDate) < 0

  protected getUnitValue(item: UnitDemo) {
    if (item.title === 'Month') return this.monthValue()
    if (item.title === 'Quarter') return this.quarterValue()
    return this.yearValue()
  }

  protected setUnitValue(item: UnitDemo, value: CalendarValue) {
    if (item.title === 'Month') this.monthValue.set(value)
    if (item.title === 'Quarter') this.quarterValue.set(value)
    if (item.title === 'Year') this.yearValue.set(value)
  }
}
