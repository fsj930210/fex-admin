import {
  computed,
  EventEmitter,
  Injectable,
  signal,
} from '@angular/core'
import {
  getCalendarToday,
  type CalendarDate,
  type CalendarPanel,
  type CalendarValue,
  type CalendarWeekday,
} from '@fex/components-core/calendar'
import {
  getCalendarValueDate,
  getCalendarValueKey,
  isSameCalendarValue,
} from '@fex/components-core/calendar/value'
import { createDatePickerDisabledDate } from '@fex/components-core/date-picker/constraints'
import { getDefaultPanelByPicker } from '@fex/components-core/date-picker/panel'
import { getDefaultDatePickerFormat } from '@fex/components-core/date-picker/value'
import type { DatePickerPicker } from '@fex/components-core/date-picker/types'
import type { DatePickerContextValue, DatePickerSelectionValue } from './context'

export interface UseDatePickerOptions<TValue extends CalendarValue = CalendarValue> {
  picker?: DatePickerPicker | undefined
  value?: DatePickerSelectionValue<TValue> | undefined
  defaultValue?: DatePickerSelectionValue<TValue> | undefined
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  multiple?: boolean | undefined
  needConfirm?: boolean | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  allowClear?: boolean | undefined
  format?: string | undefined
  weekStartsOn?: CalendarWeekday | undefined
  minDate?: CalendarDate | undefined
  maxDate?: CalendarDate | undefined
  disabledDate?: ((date: CalendarDate) => boolean) | undefined
}

function isSelectionArray<TValue extends CalendarValue>(
  value: DatePickerSelectionValue<TValue>,
): value is readonly TValue[] {
  return Array.isArray(value)
}

function emptyValue(multiple: boolean): DatePickerSelectionValue {
  return multiple ? [] : null
}

@Injectable()
export class DatePickerState<TValue extends CalendarValue = CalendarValue> {
  readonly valueChange = new EventEmitter<DatePickerSelectionValue<TValue>>()
  readonly openChange = new EventEmitter<boolean>()

  private readonly optionsState = signal<UseDatePickerOptions<TValue>>({})
  private readonly localValue = signal<DatePickerSelectionValue<TValue>>(null)
  private readonly localOpen = signal(false)
  private readonly pendingValue = signal<DatePickerSelectionValue<TValue>>(null)
  private readonly panelState = signal<CalendarPanel>('date')
  private readonly viewDateState = signal<CalendarDate>(getCalendarToday())

  readonly picker = computed(() => this.optionsState().picker ?? 'date')
  readonly multiple = computed(() => this.optionsState().multiple ?? false)
  readonly needConfirm = computed(() => this.optionsState().needConfirm ?? this.multiple())
  readonly open = computed(() => this.optionsState().open ?? this.localOpen())
  readonly panel = computed(() => this.panelState())
  readonly viewDate = computed(() => this.viewDateState())
  readonly currentValue = computed(() => this.optionsState().value ?? this.localValue())
  readonly activeValue = computed(() => this.needConfirm() ? this.pendingValue() : this.currentValue())
  readonly calendarValue = computed<TValue | null>(() => {
    const value = this.activeValue()
    return isSelectionArray(value) ? null : value
  })
  readonly calendarValues = computed<readonly TValue[]>(() => {
    const value = this.activeValue()
    return isSelectionArray(value) ? value : []
  })
  readonly disabledDate = computed(() => {
    const options = this.optionsState()
    return createDatePickerDisabledDate({
      picker: this.picker(),
      panel: this.panel(),
      ...(options.minDate ? { minDate: options.minDate } : {}),
      ...(options.maxDate ? { maxDate: options.maxDate } : {}),
      ...(options.disabledDate ? { disabledDate: options.disabledDate } : {}),
    })
  })

  setOptions(options: UseDatePickerOptions<TValue>) {
    const previousPicker = this.picker()
    this.optionsState.set(options)
    const fallbackValue = options.defaultValue ?? emptyValue(options.multiple ?? false)
    if (options.value === undefined && this.localValue() === null) this.localValue.set(fallbackValue as DatePickerSelectionValue<TValue>)
    if (options.open === undefined) this.localOpen.set(options.defaultOpen ?? this.localOpen())
    if (previousPicker !== this.picker()) this.panelState.set(getDefaultPanelByPicker(this.picker()))
    if (!this.open()) this.pendingValue.set(this.currentValue())
  }

  context(): DatePickerContextValue<TValue> {
    const options = this.optionsState()
    return {
      picker: this.picker(),
      multiple: this.multiple(),
      needConfirm: this.needConfirm(),
      disabled: options.disabled ?? false,
      readOnly: options.readOnly ?? false,
      allowClear: options.allowClear ?? true,
      format: options.format ?? getDefaultDatePickerFormat(this.picker()),
      weekStartsOn: options.weekStartsOn ?? 0,
      open: this.open(),
      panel: this.panel(),
      viewDate: this.viewDate(),
      value: this.activeValue(),
      calendarValue: this.calendarValue(),
      calendarValues: this.calendarValues(),
      ...(options.minDate ? { minDate: options.minDate } : {}),
      ...(options.maxDate ? { maxDate: options.maxDate } : {}),
      disabledDate: this.disabledDate(),
      setPanel: (panel) => this.setPanel(panel),
      setViewDate: (viewDate) => this.setViewDate(viewDate),
      setOpen: (open) => this.setOpen(open),
      openPanel: () => this.setOpen(true),
      close: () => this.close(),
      clear: () => this.clear(),
      confirm: () => this.confirm(),
      cancel: () => this.cancel(),
      select: (value) => this.select(value),
    }
  }

  setPanel(panel: CalendarPanel) {
    this.panelState.set(panel)
  }

  setViewDate(viewDate: CalendarDate) {
    this.viewDateState.set(viewDate)
  }

  setOpen(open: boolean) {
    if (open && !this.open()) this.resetPanel()
    if (this.optionsState().open === undefined) this.localOpen.set(open)
    this.openChange.emit(open)
  }

  openPanel() {
    this.setOpen(true)
  }

  close() {
    this.setOpen(false)
  }

  clear() {
    const nextValue = emptyValue(this.multiple()) as DatePickerSelectionValue<TValue>
    this.pendingValue.set(nextValue)
    this.commit(nextValue)
  }

  confirm() {
    this.commit(this.pendingValue())
    this.close()
  }

  cancel() {
    this.pendingValue.set(this.currentValue())
    this.close()
  }

  select(nextValue: TValue) {
    if (this.multiple()) {
      const current = isSelectionArray(this.activeValue()) ? this.activeValue() as readonly TValue[] : []
      const selected = current.some((item) => isSameCalendarValue(item, nextValue))
      const next = selected
        ? current.filter((item) => !isSameCalendarValue(item, nextValue))
        : [...current, nextValue]
      if (this.needConfirm()) this.pendingValue.set(next)
      else this.commit(next)
      return
    }

    if (this.needConfirm()) {
      this.pendingValue.set(nextValue)
      return
    }
    this.commit(nextValue)
    this.close()
  }

  private resetPanel() {
    this.panelState.set(getDefaultPanelByPicker(this.picker()))
    const currentValue = this.currentValue()
    const selected = isSelectionArray(currentValue) ? currentValue[0] : currentValue
    this.viewDateState.set(selected ? getCalendarValueDate(selected) : getCalendarToday())
    this.pendingValue.set(currentValue)
  }

  private commit(value: DatePickerSelectionValue<TValue>) {
    if (this.optionsState().value === undefined) this.localValue.set(value)
    this.pendingValue.set(value)
    this.valueChange.emit(value)
  }
}

export function getSelectionDisplayKey(value: CalendarValue) {
  return getCalendarValueKey(value)
}
