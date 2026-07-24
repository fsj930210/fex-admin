import type { SnapshotStore } from '../store/create-store'

export interface TimeValue {
  hour: number
  minute: number
  second: number
  millisecond?: number | undefined
}

export type TimePeriod = 'am' | 'pm'
export type TimePickerUnit = 'hour' | 'minute' | 'second' | 'period'
export type TimePickerScrollBehavior = 'auto' | 'smooth'

export type DisabledTime = (now: TimeValue) => {
  disabledHours?: (() => number[]) | undefined
  disabledMinutes?: ((selectedHour: number) => number[]) | undefined
  disabledSeconds?: ((selectedHour: number, selectedMinute: number) => number[]) | undefined
  disabledMilliseconds?: ((
    selectedHour: number,
    selectedMinute: number,
    selectedSecond: number,
  ) => number[]) | undefined
}

export interface TimePickerChangeDetails {
  reason: TimePickerUnit | 'input' | 'clear'
  previousValue: TimeValue | null
}

export interface TimePickerSnapshot {
  value: TimeValue | null
  scrollRequest: { id: number; behavior: TimePickerScrollBehavior } | null
}

export interface TimePickerControllerOptions {
  value?: TimeValue | null | undefined
  defaultValue?: TimeValue | null | undefined
  onChange?: ((value: TimeValue | null, details: TimePickerChangeDetails) => void) | undefined
}

export interface TimePickerController extends SnapshotStore<TimePickerSnapshot> {
  setControlledValue(value: TimeValue | null): void
  change(value: TimeValue | null, reason: TimePickerChangeDetails['reason'], scroll?: TimePickerScrollBehavior): void
  selectHour(hour: number, use12Hours?: boolean): void
  selectMinute(minute: number): void
  selectSecond(second: number): void
  selectPeriod(period: TimePeriod): void
  clear(): void
  scrollToValue(behavior?: TimePickerScrollBehavior): void
}

export interface TimePickerOption<TValue extends number | TimePeriod = number> {
  value: TValue
  label: string
  disabled: boolean
}
