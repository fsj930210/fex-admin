import {
  createHourOptions,
  createMinuteOptions,
  createPeriodOptions,
  createSecondOptions,
  getDisplayedHour,
  getDisplayedPeriod,
  resolveDisabledTime,
} from '@fex/components-core/time-picker/options'
import type { TimePeriod } from '@fex/components-core/time-picker/types'
import type { ComponentProps } from 'react'
import { TimePickerColumn } from './time-picker-column'
import { useTimePickerContext } from './time-picker-context'

type BaseColumnProps = Omit<
  ComponentProps<typeof TimePickerColumn<number>>,
  'options' | 'selectedValue' | 'onSelect'
>

export interface TimePickerNumericColumnProps extends BaseColumnProps {
  step?: number | undefined
  isItemDisabled?: ((value: number) => boolean) | undefined
}

export function TimePickerHourColumn({
  step,
  isItemDisabled,
  ...props
}: TimePickerNumericColumnProps) {
  const context = useTimePickerContext('TimePickerHourColumn')
  const disabled = resolveDisabledTime(context.disabledTime, context.snapshot.value).hours
  const options = createHourOptions({
    step,
    use12Hours: context.use12Hours,
    period: context.snapshot.value ? getDisplayedPeriod(context.snapshot.value) : 'am',
    disabled,
  }).map((option) => ({
    ...option,
    disabled: option.disabled || Boolean(isItemDisabled?.(option.value)),
  }))
  const selected = context.snapshot.value
    ? getDisplayedHour(context.snapshot.value, context.use12Hours)
    : undefined
  return (
    <TimePickerColumn
      {...props}
      options={options}
      selectedValue={selected}
      onSelect={(value) => context.controller.selectHour(value, context.use12Hours)}
    />
  )
}

export function TimePickerMinuteColumn({
  step,
  isItemDisabled,
  ...props
}: TimePickerNumericColumnProps) {
  const context = useTimePickerContext('TimePickerMinuteColumn')
  const disabled = resolveDisabledTime(context.disabledTime, context.snapshot.value).minutes
  const options = createMinuteOptions(step, disabled).map((option) => ({
    ...option,
    disabled: option.disabled || Boolean(isItemDisabled?.(option.value)),
  }))
  return (
    <TimePickerColumn
      {...props}
      options={options}
      selectedValue={context.snapshot.value?.minute}
      onSelect={context.controller.selectMinute}
    />
  )
}

export function TimePickerSecondColumn({
  step,
  isItemDisabled,
  ...props
}: TimePickerNumericColumnProps) {
  const context = useTimePickerContext('TimePickerSecondColumn')
  const disabled = resolveDisabledTime(context.disabledTime, context.snapshot.value).seconds
  const options = createSecondOptions(step, disabled).map((option) => ({
    ...option,
    disabled: option.disabled || Boolean(isItemDisabled?.(option.value)),
  }))
  return (
    <TimePickerColumn
      {...props}
      options={options}
      selectedValue={context.snapshot.value?.second}
      onSelect={context.controller.selectSecond}
    />
  )
}

export interface TimePickerPeriodColumnProps extends Omit<
  ComponentProps<typeof TimePickerColumn<TimePeriod>>,
  'options' | 'selectedValue' | 'onSelect'
> {
  labels?: { am: string; pm: string } | undefined
  isItemDisabled?: ((value: TimePeriod) => boolean) | undefined
}

export function TimePickerPeriodColumn({
  labels,
  isItemDisabled,
  ...props
}: TimePickerPeriodColumnProps) {
  const context = useTimePickerContext('TimePickerPeriodColumn')
  if (!context.use12Hours) return null
  const options = createPeriodOptions(labels).map((option) => ({
    ...option,
    disabled: option.disabled || Boolean(isItemDisabled?.(option.value)),
  }))
  const selected = context.snapshot.value ? getDisplayedPeriod(context.snapshot.value) : undefined
  return (
    <TimePickerColumn
      {...props}
      options={options}
      selectedValue={selected}
      onSelect={context.controller.selectPeriod}
    />
  )
}
