import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, ViewChild, signal } from '@angular/core'
import { getCalendarToday, getCalendarValueDate, type CalendarRange, type CalendarValue } from '@fex/components-core/calendar'
import { formatDatePickerValue } from '@fex/components-core/date-picker/value'
import { endOfDate } from '@fex/components-core/date/utils'
import { datePickerDateTimePanelClassName } from '@fex/components-styles/date-picker'
import {
  DatePickerCancel,
  DatePickerConfirm,
  DatePickerContent,
  DatePickerFooter,
  DatePickerPanel,
  DatePickerPreset,
  DatePickerRoot,
  DatePickerTrigger,
  RangePickerContent,
  RangePickerPanelGroup,
  RangePickerRoot,
  RangePickerState,
  RangePickerTrigger,
} from '@fex/components-angular/primitive/date-picker'
import { TimePickerHourColumn, TimePickerMinuteColumn, TimePickerPanel, TimePickerRoot, TimePickerSecondColumn, type TimeValue } from '@fex/components-angular/primitive/time-picker'
import { Card } from '@fex/components-angular/ui/card'

const today = getCalendarToday()

function isValueArray(value: CalendarValue | readonly CalendarValue[] | null): value is readonly CalendarValue[] {
  return Array.isArray(value)
}

@Component({
  selector: 'demo-preset-range-panel',
  standalone: true,
  imports: [DatePickerPreset, RangePickerPanelGroup],
  templateUrl: './preset-range-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresetRangePanel {
  @Output() readonly selectRange = new EventEmitter<CalendarRange<CalendarValue>>()
  protected readonly presets: Array<[string, CalendarRange<CalendarValue>]> = [
    ['最近 7 天', lastDays(7)],
    ['最近 30 天', lastDays(30)],
    ['本月', thisMonth()],
    ['上月', previousMonth()],
  ]

  constructor(readonly state: RangePickerState) {}

  select(value: CalendarRange<CalendarValue>) {
    this.selectRange.emit(value)
    if (value.start) this.state.setViewDate(getCalendarValueDate(value.start))
  }

  isSelected(value: CalendarRange<CalendarValue>) {
    return getRangeKey(this.state.context().rangeValue) === getRangeKey(value)
  }
}

@Component({
  selector: 'demo-integration-demos',
  standalone: true,
  imports: [
    Card,
    DatePickerRoot,
    DatePickerTrigger,
    DatePickerContent,
    DatePickerPanel,
    DatePickerFooter,
    DatePickerCancel,
    DatePickerConfirm,
    RangePickerRoot,
    RangePickerTrigger,
    RangePickerContent,
    RangePickerPanelGroup,
    PresetRangePanel,
    TimePickerRoot,
    TimePickerPanel,
    TimePickerHourColumn,
    TimePickerMinuteColumn,
    TimePickerSecondColumn,
  ],
  templateUrl: './integration-demos.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegrationDemos {
  protected readonly presetRange = signal<CalendarRange<CalendarValue>>(lastDays(7))
  protected readonly submitted = signal<CalendarRange<CalendarValue>>({})
  protected readonly submitCount = signal(0)
  protected readonly dateTimeDate = signal<CalendarValue | null>(today)
  protected readonly time = signal({ hour: 9, minute: 30, second: 0 })
  protected readonly draftTime = signal(this.time())
  protected readonly dateTimePanelClassName = `min-w-0 flex-1 self-start ${datePickerDateTimePanelClassName}`
  @ViewChild('dateTimeHourColumn', { read: ElementRef }) private readonly hourColumn?: ElementRef<HTMLElement>
  @ViewChild('dateTimeMinuteColumn', { read: ElementRef }) private readonly minuteColumn?: ElementRef<HTMLElement>
  @ViewChild('dateTimeSecondColumn', { read: ElementRef }) private readonly secondColumn?: ElementRef<HTMLElement>

  protected rangeText(value: CalendarRange<CalendarValue>) {
    return `${value.start ? formatDatePickerValue(value.start, { picker: 'date' }) : '空'} ~ ${value.end ? formatDatePickerValue(value.end, { picker: 'date' }) : '空'}`
  }

  protected setDateTimeDate(value: CalendarValue | readonly CalendarValue[] | null) {
    this.dateTimeDate.set(isValueArray(value) ? null : value)
  }

  protected dateTimeDisplayValue() {
    return `${formatDatePickerValue(this.dateTimeDate(), { picker: 'date' })} ${formatTime(this.time())}`.trim()
  }

  protected formatTime(value: { hour: number; minute: number; second?: number }) {
    return formatTime(value)
  }

  protected openDateTimePanel(open: boolean) {
    if (!open) return
    this.draftTime.set(this.time())
    this.syncDateTimeScroll()
  }

  protected changeDraftTime(value: TimeValue | null) {
    if (!value) return
    this.draftTime.set(value)
    this.syncDateTimeScroll()
  }

  private syncDateTimeScroll() {
    const value = this.draftTime()
    const run = () => {
      scrollTimeColumn(this.hourColumn, value.hour)
      scrollTimeColumn(this.minuteColumn, value.minute)
      scrollTimeColumn(this.secondColumn, value.second ?? 0)
    }
    queueMicrotask(run)
    requestAnimationFrame(run)
  }
}

function lastDays(days: number): CalendarRange<CalendarValue> {
  return { start: today.subtract({ days: days - 1 }), end: today }
}

function thisMonth(): CalendarRange<CalendarValue> {
  return { start: today.with({ day: 1 }), end: endOfDate(today, 'month') }
}

function previousMonth(): CalendarRange<CalendarValue> {
  const end = today.with({ day: 1 }).subtract({ days: 1 })
  return { start: end.with({ day: 1 }), end }
}

function getRangeKey(value: CalendarRange<CalendarValue>) {
  return `${value.start ? formatDatePickerValue(value.start, { picker: 'date' }) : ''}~${value.end ? formatDatePickerValue(value.end, { picker: 'date' }) : ''}`
}

function formatTime(value: { hour: number; minute: number; second?: number }) {
  return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}:${String(value.second ?? 0).padStart(2, '0')}`
}

function scrollTimeColumn(column: ElementRef<HTMLElement> | undefined, value: number) {
  const viewport = column?.nativeElement.querySelector<HTMLElement>('[data-slot="scrollbar-viewport"]')
  viewport?.scrollTo({ top: value * 32, behavior: 'auto' })
}
