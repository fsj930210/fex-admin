import { EventEmitter, Injectable, computed, signal } from '@angular/core'
import {
  getCalendarToday,
  type CalendarDate,
  type CalendarPanel,
  type CalendarRange,
  type CalendarValue,
  type CalendarWeekday,
} from '@fex/components-core/calendar'
import { getCalendarValueDate } from '@fex/components-core/calendar/value'
import { createDatePickerDisabledDate } from '@fex/components-core/date-picker/constraints'
import { getDefaultPanelByPicker } from '@fex/components-core/date-picker/panel'
import {
  createNextRangeValue,
  getNextRangeActivePart,
  getRangeFromValue,
} from '@fex/components-core/date-picker/range'
import { getDefaultDatePickerFormat } from '@fex/components-core/date-picker/value'
import type { DatePickerPicker } from '@fex/components-core/date-picker/types'
import type { RangePickerContextValue } from './context'

export interface UseRangePickerOptions<TValue extends CalendarValue = CalendarValue> {
  picker?: DatePickerPicker | undefined
  status?: 'error' | 'warning' | undefined
  value?: CalendarRange<TValue> | undefined
  defaultValue?: CalendarRange<TValue> | undefined
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  needConfirm?: boolean | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  allowClear?: boolean | undefined
  allowEmpty?: boolean | { start?: boolean; end?: boolean } | undefined
  order?: boolean | undefined
  format?: string | undefined
  weekStartsOn?: CalendarWeekday | undefined
  minDate?: CalendarDate | undefined
  maxDate?: CalendarDate | undefined
  disabledDate?: ((date: CalendarDate, activePart: 'start' | 'end') => boolean) | undefined
}

function normalizeAllowEmpty(value: UseRangePickerOptions['allowEmpty']) {
  if (value === true) return { start: true, end: true }
  if (value && typeof value === 'object')
    return { start: Boolean(value.start), end: Boolean(value.end) }
  return { start: false, end: false }
}

@Injectable()
export class RangePickerState<TValue extends CalendarValue = CalendarValue> {
  readonly valueChange = new EventEmitter<CalendarRange<TValue>>()
  readonly openChange = new EventEmitter<boolean>()

  private readonly optionsState = signal<UseRangePickerOptions<TValue>>({})
  private readonly localValue = signal<CalendarRange<TValue>>({})
  private readonly localOpen = signal(false)
  private readonly pendingValue = signal<CalendarRange<TValue>>({})
  private readonly activePartState = signal<'start' | 'end'>('start')
  private readonly hoverValueState = signal<TValue | null>(null)
  private readonly panelState = signal<CalendarPanel>('date')
  private readonly viewDateState = signal<CalendarDate>(getCalendarToday())

  readonly picker = computed(() => this.optionsState().picker ?? 'date')
  readonly needConfirm = computed(() => this.optionsState().needConfirm ?? false)
  readonly open = computed(() => this.optionsState().open ?? this.localOpen())
  readonly rangeValue = computed(() => this.optionsState().value ?? this.localValue())
  readonly activeRangeValue = computed(() =>
    this.needConfirm() || this.open() ? this.pendingValue() : this.rangeValue(),
  )
  readonly activePart = computed(() => this.activePartState())
  readonly hoverValue = computed(() => this.hoverValueState())
  readonly panel = computed(() => this.panelState())
  readonly viewDate = computed(() => this.viewDateState())

  setOptions(options: UseRangePickerOptions<TValue>) {
    const previousPicker = this.picker()
    this.optionsState.set(options)
    if (options.value === undefined && !this.localValue().start && !this.localValue().end) {
      this.localValue.set(options.defaultValue ?? {})
    }
    if (options.open === undefined) this.localOpen.set(options.defaultOpen ?? this.localOpen())
    if (previousPicker !== this.picker())
      this.panelState.set(getDefaultPanelByPicker(this.picker()))
    if (!this.open()) this.pendingValue.set(this.rangeValue())
  }

  context(): RangePickerContextValue<TValue> {
    const options = this.optionsState()
    return {
      picker: this.picker(),
      status: options.status,
      needConfirm: this.needConfirm(),
      disabled: options.disabled ?? false,
      readOnly: options.readOnly ?? false,
      allowClear: options.allowClear ?? true,
      allowEmpty: normalizeAllowEmpty(options.allowEmpty),
      format: options.format ?? getDefaultDatePickerFormat(this.picker()),
      weekStartsOn: options.weekStartsOn ?? 0,
      open: this.open(),
      panel: this.panel(),
      viewDate: this.viewDate(),
      rangeValue: this.activeRangeValue(),
      activePart: this.activePart(),
      hoverValue: this.hoverValue(),
      ...(options.minDate ? { minDate: options.minDate } : {}),
      ...(options.maxDate ? { maxDate: options.maxDate } : {}),
      disabledDate: (date, part) => this.isDisabledDate(date, part),
      setPanel: (panel) => this.setPanel(panel),
      setViewDate: (viewDate) => this.setViewDate(viewDate),
      setOpen: (open) => this.setOpen(open),
      setActivePart: (part) => this.setActivePart(part),
      setHoverValue: (value) => this.setHoverValue(value),
      openPanel: (part) => this.openPanel(part),
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

  setOpen(open: boolean, part?: 'start' | 'end') {
    if (open && !this.open()) this.resetPanel(part)
    else if (open && part) this.activePartState.set(part)
    if (this.optionsState().open === undefined) this.localOpen.set(open)
    if (!open) this.hoverValueState.set(null)
    this.openChange.emit(open)
  }

  setActivePart(part: 'start' | 'end') {
    this.activePartState.set(part)
  }

  setHoverValue(value: TValue | null) {
    this.hoverValueState.set(value)
  }

  openPanel(part?: 'start' | 'end') {
    this.setOpen(true, part)
  }

  close() {
    this.setOpen(false)
  }

  clear() {
    const next: CalendarRange<TValue> = {}
    this.pendingValue.set(next)
    this.hoverValueState.set(null)
    this.commit(next)
  }

  confirm() {
    this.commit(this.pendingValue())
    this.close()
  }

  cancel() {
    this.pendingValue.set(this.rangeValue())
    this.close()
  }

  select(nextValue: TValue) {
    const nextRange = createNextRangeValue(
      this.activeRangeValue(),
      nextValue,
      this.activePart(),
      this.optionsState().order ?? true,
    )
    this.hoverValueState.set(null)
    this.pendingValue.set(nextRange)
    if (!this.needConfirm()) this.commit(nextRange)

    const nextActivePart = getNextRangeActivePart(nextRange)
    if (nextActivePart) {
      this.activePartState.set(nextActivePart)
      return
    }
    if (!this.needConfirm()) this.close()
  }

  private resetPanel(part?: 'start' | 'end') {
    this.panelState.set(getDefaultPanelByPicker(this.picker()))
    const selected = this.rangeValue().start ?? this.rangeValue().end
    this.viewDateState.set(selected ? getCalendarValueDate(selected) : getCalendarToday())
    this.pendingValue.set(this.rangeValue())
    this.activePartState.set(part ?? (this.rangeValue().start ? 'end' : 'start'))
    this.hoverValueState.set(null)
  }

  private isDisabledDate(date: CalendarDate, part: 'start' | 'end') {
    const options = this.optionsState()
    return createDatePickerDisabledDate({
      picker: this.picker(),
      panel: this.panel(),
      ...(options.minDate ? { minDate: options.minDate } : {}),
      ...(options.maxDate ? { maxDate: options.maxDate } : {}),
      ...(options.disabledDate
        ? { disabledDate: (currentDate) => Boolean(options.disabledDate?.(currentDate, part)) }
        : {}),
    })(date, {
      activePart: part,
      from: getRangeFromValue(this.activeRangeValue(), part),
      rangeValue: this.activeRangeValue(),
    })
  }

  private commit(value: CalendarRange<TValue>) {
    if (this.optionsState().value === undefined) this.localValue.set(value)
    this.pendingValue.set(value)
    this.valueChange.emit(value)
  }
}
