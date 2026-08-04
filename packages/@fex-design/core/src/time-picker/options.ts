import { from12Hour, getTimePeriod, to12Hour } from './value'
import type { DisabledTime, TimePeriod, TimePickerOption, TimeValue } from './types'

export function normalizeTimeStep(step: number | undefined, maximum: number): number {
  if (step === undefined) return 1
  if (!Number.isInteger(step) || step < 1 || step > maximum) return 1
  return step
}

export function createHourOptions(
  options: {
    step?: number | undefined
    use12Hours?: boolean | undefined
    period?: TimePeriod | undefined
    disabled?: readonly number[] | undefined
  } = {},
): TimePickerOption[] {
  const step = normalizeTimeStep(options.step, 23)
  const disabled = new Set(options.disabled)
  const values = Array.from({ length: Math.ceil(24 / step) }, (_, index) => index * step).filter(
    (value) => value < 24,
  )

  if (!options.use12Hours) {
    return values.map((value) => ({ value, label: padTime(value), disabled: disabled.has(value) }))
  }

  // A 12-hour column represents the visible clock hour only. Period conversion
  // remains in the controller so the stored value is always unambiguous 24-hour time.
  const clockHours = Array.from({ length: 12 }, (_, index) => index + 1).filter(
    (value) => (value === 12 ? 0 : value) % step === 0,
  )
  return clockHours.map((value) => ({
    value,
    label: padTime(value),
    disabled: disabled.has(from12Hour(value, options.period ?? 'am')),
  }))
}

export function createMinuteOptions(
  step?: number,
  disabled?: readonly number[],
): TimePickerOption[] {
  return createNumericOptions(60, step, disabled)
}

export function createSecondOptions(
  step?: number,
  disabled?: readonly number[],
): TimePickerOption[] {
  return createNumericOptions(60, step, disabled)
}

export function createPeriodOptions(
  labels: { am: string; pm: string } = { am: 'AM', pm: 'PM' },
  disabled: readonly TimePeriod[] = [],
): TimePickerOption<TimePeriod>[] {
  const disabledSet = new Set(disabled)
  return (['am', 'pm'] as const).map((value) => ({
    value,
    label: labels[value],
    disabled: disabledSet.has(value),
  }))
}

export function resolveDisabledTime(
  disabledTime: DisabledTime | undefined,
  value: TimeValue | null,
) {
  const current = value ?? { hour: 0, minute: 0, second: 0 }
  const result = disabledTime?.(current)
  return {
    hours: result?.disabledHours?.() ?? [],
    minutes: result?.disabledMinutes?.(current.hour) ?? [],
    seconds: result?.disabledSeconds?.(current.hour, current.minute) ?? [],
    milliseconds:
      result?.disabledMilliseconds?.(current.hour, current.minute, current.second) ?? [],
  }
}

export function getDisplayedHour(value: TimeValue, use12Hours: boolean): number {
  return use12Hours ? to12Hour(value.hour) : value.hour
}

export function getDisplayedPeriod(value: TimeValue): TimePeriod {
  return getTimePeriod(value.hour)
}

function createNumericOptions(
  range: number,
  rawStep?: number,
  disabledValues: readonly number[] = [],
): TimePickerOption[] {
  const step = normalizeTimeStep(rawStep, range - 1)
  const disabled = new Set(disabledValues)
  const result: TimePickerOption[] = []
  for (let value = 0; value < range; value += step) {
    result.push({ value, label: padTime(value), disabled: disabled.has(value) })
  }
  return result
}

function padTime(value: number): string {
  return String(value).padStart(2, '0')
}
