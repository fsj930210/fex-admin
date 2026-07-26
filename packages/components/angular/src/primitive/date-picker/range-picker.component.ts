import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal, type OnInit } from '@angular/core'
import { getCalendarToday, getCalendarValueDate, type CalendarCell, type CalendarDate, type CalendarPanel, type CalendarRange, type CalendarValue, type CalendarWeekday } from '@fex/components-core/calendar'
import { createDatePickerDisabledDate } from '@fex/components-core/date-picker/constraints'
import { getDefaultPanelByPicker, getGranularityByPicker, getRangePanelViewDates } from '@fex/components-core/date-picker/panel'
import { createNextRangeValue, getRangeFromValue } from '@fex/components-core/date-picker/range'
import { formatDatePickerValue, normalizeDatePickerValue, parseDatePickerValue } from '@fex/components-core/date-picker/value'
import type { DatePickerInputPart, DatePickerPicker } from '@fex/components-core/date-picker/types'
import { datePickerCellClassName, datePickerContentClassName, datePickerFooterClassName, datePickerGridClassName, datePickerHeaderClassName, datePickerHeaderLabelClassName, datePickerHeaderNavigationClassName, datePickerPanelClassName, datePickerPanelsClassName, datePickerRangeInputClassName, datePickerWeekHeaderClassName } from '@fex/components-styles/date-picker'
import { CalendarCellButton, CalendarGrid, CalendarHeader, CalendarRoot, CalendarWeekHeader } from '../calendar/calendar'
import { CalendarIcon } from '../../icon/calendar'
import { ChevronLeftIcon, ChevronRightIcon } from '../../icon/chevron'
import { Button } from '../../ui/button/button'
import { InputClear, InputControl, InputRoot, InputSuffix } from '../input/input'
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover'
import { createHostClassName } from '../../signals/host-class'

@Component({ selector: 'fex-range-picker', standalone: true, imports: [Popover, PopoverTrigger, PopoverContent, InputRoot, InputControl, InputClear, InputSuffix, CalendarRoot, CalendarHeader, CalendarWeekHeader, CalendarGrid, CalendarCellButton, CalendarIcon, ChevronLeftIcon, ChevronRightIcon, Button], templateUrl: './range-picker.component.html', changeDetection: ChangeDetectionStrategy.OnPush, host: { '[class]': 'hostClassName()' } })
export class RangePicker implements OnInit {
  protected readonly hostClassName = createHostClassName('block')
  private readonly valueInput = signal<CalendarRange<CalendarValue> | undefined>(undefined)
  @Input() set value(value: CalendarRange<CalendarValue> | undefined) { this.valueInput.set(value) }
  get value() { return this.valueInput() }
  @Input() defaultValue?: CalendarRange<CalendarValue>
  @Input() open?: boolean
  @Input() defaultOpen = false
  @Input() picker: DatePickerPicker = 'date'
  @Input() needConfirm = false
  @Input() disabled = false
  @Input() readOnly = false
  @Input() allowEmpty: boolean | { start?: boolean; end?: boolean } = false
  @Input() allowClear = true
  @Input() order = true
  @Input() panelCount: 1 | 2 = 2
  @Input() minDate?: CalendarDate
  @Input() maxDate?: CalendarDate
  @Input() weekStartsOn: CalendarWeekday = 0
  @Input() disabledDate?: (date: CalendarDate, part: DatePickerInputPart) => boolean
  @Output() readonly change = new EventEmitter<CalendarRange<CalendarValue>>()
  @Output() readonly openChange = new EventEmitter<boolean>()
  protected readonly localValue = signal<CalendarRange<CalendarValue>>({})
  protected readonly localOpen = signal(false)
  protected readonly pending = signal<CalendarRange<CalendarValue>>({})
  protected readonly activePart = signal<DatePickerInputPart>('start')
  protected readonly focusedPart = signal<DatePickerInputPart | null>(null)
  protected readonly panel = signal<CalendarPanel>('date')
  protected readonly viewDate = signal(getCalendarToday())
  protected readonly contentClassName = datePickerContentClassName
  protected readonly panelsClassName = datePickerPanelsClassName
  protected readonly panelClassName = datePickerPanelClassName
  protected readonly headerClassName = datePickerHeaderClassName
  protected readonly headerNavigationClassName = datePickerHeaderNavigationClassName
  protected readonly headerLabelClassName = datePickerHeaderLabelClassName
  protected readonly weekHeaderClassName = datePickerWeekHeaderClassName
  protected readonly gridClassName = datePickerGridClassName
  protected readonly cellClassName = datePickerCellClassName
  protected readonly footerClassName = datePickerFooterClassName
  protected readonly rangeInputClassName = datePickerRangeInputClassName
  readonly currentValue = computed(() => this.valueInput() ?? this.localValue())
  readonly activeValue = computed(() => this.needConfirm ? this.pending() : this.currentValue())
  readonly panelDates = computed(() => getRangePanelViewDates(this.viewDate(), this.panel()))
  readonly visiblePanelDates = computed(() => this.panelCount === 1 || (this.picker !== 'date' && this.picker !== 'week') ? [this.panelDates()[0]] : this.panelDates())
  readonly startDisplay = computed(() => formatDatePickerValue(this.currentValue().start ?? null, { picker: this.picker, weekStartsOn: this.weekStartsOn }))
  readonly endDisplay = computed(() => formatDatePickerValue(this.currentValue().end ?? null, { picker: this.picker, weekStartsOn: this.weekStartsOn }))
  readonly display = computed(() => `${this.startDisplay()} - ${this.endDisplay()}`)
  readonly getGranularityByPicker = getGranularityByPicker
  ngOnInit() {
    const initialValue = this.defaultValue ?? {}
    this.localValue.set(initialValue)
    this.pending.set(initialValue)
    this.localOpen.set(this.defaultOpen)
  }
  setOpen(next: boolean) { if (this.open === undefined) this.localOpen.set(next); if (next) this.pending.set(this.currentValue()); if (!next) { this.panel.set(getDefaultPanelByPicker(this.picker)); this.focusedPart.set(null) }; this.openChange.emit(next) }
  close() { this.setOpen(false) }
  clear() {
    const allowed = this.allowEmpty === true
      ? { start: true, end: true }
      : typeof this.allowEmpty === 'object'
        ? { start: Boolean(this.allowEmpty.start), end: Boolean(this.allowEmpty.end) }
        : { start: false, end: false }
    const current = this.activeValue()
    const next: CalendarRange<CalendarValue> = {}
    if (!allowed.start && current.start) next.start = current.start
    if (!allowed.end && current.end) next.end = current.end
    this.pending.set(next)
    this.commit(next)
  }
  selectCell(cell: CalendarCell) { const date = getCalendarValueDate(cell.value); this.viewDate.set(date); if (cell.panel === 'year' && this.picker !== 'year') { this.panel.set(this.picker === 'month' || this.picker === 'quarter' ? getDefaultPanelByPicker(this.picker) : 'month'); return }; if (cell.panel === 'month' && this.picker !== 'month') { this.panel.set('date'); return }; const next = createNextRangeValue(this.activeValue(), normalizeDatePickerValue(date, this.picker, this.weekStartsOn), this.activePart(), this.order); if (this.needConfirm) this.pending.set(next); else this.commit(next); if (this.activePart() === 'start') { this.activePart.set('end'); this.focusedPart.set('end') } else if (next.start && next.end && !this.needConfirm) this.close() }
  calendarDisabled(date: CalendarDate) { return createDatePickerDisabledDate({ picker: this.picker, panel: this.panel(), ...(this.minDate ? { minDate: this.minDate } : {}), ...(this.maxDate ? { maxDate: this.maxDate } : {}), ...(this.disabledDate ? { disabledDate: value => Boolean(this.disabledDate?.(value, this.activePart())) } : {}) })(date, { activePart: this.activePart(), from: getRangeFromValue(this.activeValue(), this.activePart()), rangeValue: this.activeValue() }) }
  focusPart(part: DatePickerInputPart) { this.activePart.set(part); this.focusedPart.set(part) }
  openPart(part: DatePickerInputPart) { if (!this.disabled) { this.focusPart(part); this.setOpen(true) } }
  input(part: DatePickerInputPart, text: string) { this.focusPart(part); const parsed = parseDatePickerValue(text, { picker: this.picker, weekStartsOn: this.weekStartsOn }); if (!parsed.valid) return; const next = createNextRangeValue(this.activeValue(), parsed.value, part, this.order); if (this.needConfirm) this.pending.set(next); else this.commit(next) }
  protected commit(value: CalendarRange<CalendarValue>) { if (this.valueInput() === undefined) this.localValue.set(value); this.change.emit(value) }
}
