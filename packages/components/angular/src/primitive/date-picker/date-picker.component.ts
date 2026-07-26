import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal, type OnInit } from '@angular/core'
import { getCalendarToday, getCalendarValueDate, type CalendarCell, type CalendarDate, type CalendarPanel, type CalendarValue, type CalendarWeekday } from '@fex/components-core/calendar'
import { createDatePickerDisabledDate } from '@fex/components-core/date-picker/constraints'
import { getDefaultPanelByPicker, getGranularityByPicker } from '@fex/components-core/date-picker/panel'
import { formatDatePickerValue, normalizeDatePickerValue, parseDatePickerValue } from '@fex/components-core/date-picker/value'
import type { DatePickerPicker } from '@fex/components-core/date-picker/types'
import { datePickerCellClassName, datePickerContentClassName, datePickerFooterClassName, datePickerGridClassName, datePickerHeaderClassName, datePickerHeaderLabelClassName, datePickerHeaderNavigationClassName, datePickerPanelClassName, datePickerWeekHeaderClassName } from '@fex/components-styles/date-picker'
import { CalendarCellButton, CalendarGrid, CalendarHeader, CalendarRoot, CalendarWeekHeader } from '../calendar/calendar'
import { CalendarIcon } from '../../icon/calendar'
import { ChevronLeftIcon, ChevronRightIcon } from '../../icon/chevron'
import { CloseIcon } from '../../icon/close'
import { Button } from '../../ui/button/button'
import { InputClear, InputControl, InputRoot, InputSuffix } from '../input/input'
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover'
import { createHostClassName } from '../../signals/host-class'

@Component({
  selector: 'fex-date-picker',
  standalone: true,
  imports: [Popover, PopoverTrigger, PopoverContent, InputRoot, InputControl, InputClear, InputSuffix, CalendarRoot, CalendarHeader, CalendarWeekHeader, CalendarGrid, CalendarCellButton, CalendarIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon, Button],
  templateUrl: './date-picker.component.html',
  host: { '[class]': 'hostClassName()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePicker implements OnInit {
  protected readonly hostClassName = createHostClassName('block')
  private readonly valueInput = signal<CalendarValue | readonly CalendarValue[] | null | undefined>(undefined)
  @Input() set value(value: CalendarValue | readonly CalendarValue[] | null | undefined) { this.valueInput.set(value) }
  get value() { return this.valueInput() }
  @Input() defaultValue?: CalendarValue | readonly CalendarValue[] | null
  @Input() open?: boolean
  @Input() defaultOpen = false
  @Input() picker: DatePickerPicker = 'date'
  @Input() multiple = false
  @Input() needConfirm?: boolean
  @Input() disabled = false
  @Input() readOnly = false
  @Input() allowClear = true
  @Input() placeholder?: string
  @Input() format?: string
  @Input() weekStartsOn: CalendarWeekday = 0
  @Input() minDate?: CalendarDate
  @Input() maxDate?: CalendarDate
  @Input() disabledDate?: (date: CalendarDate) => boolean
  @Output() readonly change = new EventEmitter<CalendarValue | readonly CalendarValue[] | null>()
  @Output() readonly openChange = new EventEmitter<boolean>()

  protected readonly localValue = signal<CalendarValue | readonly CalendarValue[] | null>(this.defaultValue ?? null)
  protected readonly localOpen = signal(this.defaultOpen)
  protected readonly pendingValue = signal<CalendarValue | readonly CalendarValue[] | null>(this.localValue())
  protected readonly panel = signal<CalendarPanel>(getDefaultPanelByPicker(this.picker))
  protected readonly viewDate = signal(getCalendarToday())
  protected readonly text = signal('')
  protected readonly contentClassName = datePickerContentClassName
  protected readonly panelClassName = datePickerPanelClassName
  protected readonly headerClassName = datePickerHeaderClassName
  protected readonly headerNavigationClassName = datePickerHeaderNavigationClassName
  protected readonly headerLabelClassName = datePickerHeaderLabelClassName
  protected readonly weekHeaderClassName = datePickerWeekHeaderClassName
  protected readonly gridClassName = datePickerGridClassName
  protected readonly cellClassName = datePickerCellClassName
  protected readonly footerClassName = datePickerFooterClassName
  readonly currentValue = computed(() => this.valueInput() === undefined ? this.localValue() : this.valueInput()!)
  readonly needsConfirm = computed(() => this.needConfirm ?? this.multiple)
  readonly activeValue = computed(() => this.needsConfirm() ? this.pendingValue() : this.currentValue())
  readonly calendarValue = computed<CalendarValue | null>(() => Array.isArray(this.activeValue()) ? null : this.activeValue() as CalendarValue | null)
  readonly calendarValues = computed<readonly CalendarValue[] | undefined>(() => Array.isArray(this.activeValue()) ? this.activeValue() as readonly CalendarValue[] : undefined)
  readonly display = computed(() => Array.isArray(this.currentValue()) ? (this.currentValue() as readonly CalendarValue[]).map(value => formatDatePickerValue(value, { picker: this.picker, format: this.format, weekStartsOn: this.weekStartsOn })).join(', ') : formatDatePickerValue(this.currentValue() as CalendarValue | null, { picker: this.picker, format: this.format, weekStartsOn: this.weekStartsOn }))
  readonly inputValue = computed(() => this.text() || this.display())
  readonly calendarDisabledDate = computed(() => createDatePickerDisabledDate({ picker: this.picker, panel: this.panel(), ...(this.minDate ? { minDate: this.minDate } : {}), ...(this.maxDate ? { maxDate: this.maxDate } : {}), ...(this.disabledDate ? { disabledDate: this.disabledDate } : {}) }))

  ngOnInit() {
    const initialValue = this.defaultValue ?? (this.multiple ? [] : null)
    this.localValue.set(initialValue)
    this.pendingValue.set(initialValue)
    this.localOpen.set(this.defaultOpen)
  }
  setOpen(open: boolean) { if (this.open === undefined) this.localOpen.set(open); if (open) this.pendingValue.set(this.currentValue()); if (!open) this.panel.set(getDefaultPanelByPicker(this.picker)); this.openChange.emit(open) }
  close() { this.setOpen(false) }
  clear() { const next = this.multiple ? [] : null; this.pendingValue.set(next); this.commit(next) }
  confirm() { this.commit(this.pendingValue()); this.close() }
  cancel() { this.pendingValue.set(this.currentValue()); this.close() }
  inputValueChange(text: string) { this.text.set(text); if (this.multiple) return; const parsed = parseDatePickerValue(text, { picker: this.picker, format: this.format, weekStartsOn: this.weekStartsOn }); if (parsed.valid) this.select(parsed.value) }
  removeValue(value: CalendarValue) {
    const values = Array.isArray(this.activeValue()) ? this.activeValue() as readonly CalendarValue[] : []
    const key = formatDatePickerValue(value, { picker: this.picker })
    const next = values.filter(item => formatDatePickerValue(item, { picker: this.picker }) !== key)
    this.pendingValue.set(next)
    this.commit(next)
  }
  firstSelectedValue() { return this.calendarValues()?.[0] ?? null }
  selectCell(cell: CalendarCell) { const date = getCalendarValueDate(cell.value); this.viewDate.set(date); if (cell.panel === 'year' && this.picker !== 'year') { this.panel.set(this.picker === 'month' || this.picker === 'quarter' ? getDefaultPanelByPicker(this.picker) : 'month'); return }; if (cell.panel === 'month' && this.picker !== 'month') { this.panel.set('date'); return }; this.select(normalizeDatePickerValue(date, this.picker, this.weekStartsOn)) }
  private commit(value: CalendarValue | readonly CalendarValue[] | null) { if (this.valueInput() === undefined) this.localValue.set(value); this.text.set(''); this.change.emit(value) }
  private select(value: CalendarValue) { if (this.multiple) { const values = Array.isArray(this.activeValue()) ? this.activeValue() as readonly CalendarValue[] : []; const key = formatDatePickerValue(value, { picker: this.picker }); const next = values.some(item => formatDatePickerValue(item, { picker: this.picker }) === key) ? values.filter(item => formatDatePickerValue(item, { picker: this.picker }) !== key) : [...values, value]; if (this.needsConfirm()) this.pendingValue.set(next); else this.commit(next); return }; if (this.needsConfirm()) this.pendingValue.set(value); else { this.commit(value); this.close() } }
  protected readonly getGranularityByPicker = getGranularityByPicker
}
