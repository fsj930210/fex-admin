import { createTimePickerController } from '@fex/components-core/time-picker/create-time-picker-controller'
import { format as formatDate, parse } from '@fex/components-core/date/utils'
import {
  createHourOptions,
  createMinuteOptions,
  createPeriodOptions,
  createSecondOptions,
  getDisplayedHour,
  getDisplayedPeriod,
  resolveDisabledTime,
} from '@fex/components-core/time-picker/options'
import type {
  DisabledTime,
  TimePeriod,
  TimePickerChangeDetails,
  TimePickerOption,
  TimeValue,
} from '@fex/components-core/time-picker/types'
import {
  timePickerColumnClassName,
  timePickerColumnItemClassName,
  timePickerColumnSpacerClassName,
  timePickerColumnViewportClassName,
  timePickerRootClassName,
} from '@fex/components-styles/time-picker'
import { cn } from '@fex/utils'
import { createEffect, createMemo, createSignal, For, Show, splitProps, type JSX, type ParentProps } from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'
import { ClockIcon } from '../../icon/clock'
import { InputClear, InputControl, InputPrefix, InputRoot, InputSuffix, type InputRootProps } from '../input/input'
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger, type PopoverProps } from '../popover/popover'
import { ScrollbarBar, ScrollbarRoot, ScrollbarViewport } from '../scrollbar/scrollbar'
import { TimePickerContext, useTimePickerContext } from './time-picker-context'

export interface TimePickerRootProps extends Omit<PopoverProps, 'children'>, ParentProps {
  value?: TimeValue | null | undefined
  defaultValue?: TimeValue | null | undefined
  format?: string | undefined
  onChange?: ((value: TimeValue | null, details: TimePickerChangeDetails) => void) | undefined
  use12Hours?: boolean | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  disabledTime?: DisabledTime | undefined
}

export function TimePickerRoot(props: TimePickerRootProps) {
  const [local, rest] = splitProps(props, [
    'value',
    'defaultValue',
    'onChange',
    'format',
    'use12Hours',
    'disabled',
    'readOnly',
    'disabledTime',
    'children',
  ])
  const controller = createTimePickerController({
    value: local.value,
    defaultValue: local.defaultValue,
    onChange: (value, details) => local.onChange?.(value, details),
  })
  const snapshot = createCoreStoreSignal(controller)
  // A controlled prop is an external reactive source, so synchronize it with the core store.
  createEffect(() => {
    if (local.value !== undefined) controller.setControlledValue(local.value)
  })
  return (
    <Popover {...rest} trigger={['focus', 'click']}>
      <TimePickerContext.Provider value={{
        controller,
        snapshot,
        format: () => local.format ?? (local.use12Hours ? 'hh:mm:ss A' : 'HH:mm:ss'),
        use12Hours: () => local.use12Hours ?? false,
        disabled: () => local.disabled ?? false,
        readOnly: () => local.readOnly ?? false,
        disabledTime: () => local.disabledTime,
      }}>{local.children}</TimePickerContext.Provider>
    </Popover>
  )
}

export interface TimePickerTriggerProps extends Omit<InputRootProps, 'value' | 'defaultValue' | 'onValueChange' | 'onClear' | 'children' | 'prefix'> {
  allowClear?: boolean
  placeholder?: string
  prefix?: JSX.Element
  suffix?: JSX.Element
  inputProps?: JSX.InputHTMLAttributes<HTMLInputElement>
}

export function TimePickerTrigger(props: TimePickerTriggerProps) {
  const context = useTimePickerContext('TimePickerTrigger')
  const [local, rest] = splitProps(props, ['allowClear', 'placeholder', 'prefix', 'suffix', 'inputProps'])
  const formatted = () => context.snapshot().value ? formatDate(context.snapshot().value!, context.format()) : ''
  const [text, setText] = createSignal(formatted())
  createEffect(() => setText(formatted()))
  function input(next: string) { setText(next); const result = parse(next, context.format()); if (result.valid) context.controller.change(result.value, 'input', 'smooth') }
  function clear() { setText(''); context.controller.clear() }
  return <PopoverTrigger>{trigger => <InputRoot {...rest} {...(trigger.props as unknown as JSX.HTMLAttributes<HTMLDivElement>)} ref={trigger.ref as unknown as (element: HTMLDivElement) => void} value={text()} disabled={context.disabled()} readOnly={context.readOnly()} onValueChange={input} {...(local.allowClear === false ? {} : { onClear: clear })}><Show when={local.prefix}><InputPrefix>{local.prefix}</InputPrefix></Show><InputControl {...local.inputProps} placeholder={local.placeholder ?? context.format()} /><Show when={local.allowClear !== false}><InputClear /></Show><Show when={local.allowClear === false || !text()}><InputSuffix>{local.suffix ?? <ClockIcon class="size-4" />}</InputSuffix></Show></InputRoot>}</PopoverTrigger>
}

export function TimePickerContent(props: ParentProps<{ class?: string; style?: string }>) {
  return <PopoverPortal><PopoverContent {...props} class={cn('overflow-hidden p-0', props.class)} style={`width:var(--floating-reference-width);max-width:var(--floating-available-width);max-height:var(--floating-available-height);${props.style ?? ''}`} /></PopoverPortal>
}

export function TimePickerPanel(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  return <div {...props} data-slot="time-picker-panel" class={cn(timePickerRootClassName, props.class)}>{props.children}</div>
}

type ColumnValue = number | TimePeriod
interface InternalColumnProps<TValue extends ColumnValue> extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  'onSelect' | 'children'
> {
  options: readonly TimePickerOption<TValue>[]
  selectedValue?: TValue | undefined
  disabled?: boolean | undefined
  onSelect(value: TValue): void
}

function TimePickerColumn<TValue extends ColumnValue>(props: InternalColumnProps<TValue>) {
  const [local, rest] = splitProps(props, [
    'options',
    'selectedValue',
    'disabled',
    'onSelect',
    'class',
    'onKeyDown',
  ])
  const context = useTimePickerContext('TimePickerColumn')
  let listElement: HTMLDivElement | undefined
  const itemElements = new Map<TValue, HTMLButtonElement>()
  let activeValue: TValue | undefined
  const isDisabled = () => context.disabled() || Boolean(local.disabled)

  // Selected values are synchronized to the imperative scroll container after DOM commit.
  createEffect(() => {
    const selected = local.selectedValue
    const request = context.snapshot().scrollRequest
    queueMicrotask(() => {
      const item = selected === undefined ? undefined : itemElements.get(selected)
      if (item && listElement)
        listElement.scrollTo({ top: item.offsetTop, behavior: request?.behavior ?? 'auto' })
    })
  })

  function move(direction: 1 | -1) {
    const enabled = local.options.filter((option) => !option.disabled)
    const current = enabled.findIndex((option) => option.value === activeValue)
    const next = enabled[Math.min(enabled.length - 1, Math.max(0, current + direction))]
    if (!next) return
    activeValue = next.value
    itemElements.get(next.value)?.focus()
  }

  return (
    <ScrollbarRoot
      data-slot="time-picker-column"
      data-disabled={isDisabled() ? 'true' : undefined}
      class={cn(timePickerColumnClassName, local.class)}
      disabled={isDisabled()}
    >
      <ScrollbarViewport {...rest} ref={listElement} role="listbox" tabIndex={isDisabled() ? -1 : 0} aria-disabled={isDisabled() || undefined} overflowX="hidden" class={timePickerColumnViewportClassName} onKeyDown={(event) => {
        if (typeof local.onKeyDown === 'function') local.onKeyDown(event)
        if (event.defaultPrevented || isDisabled() || context.readOnly()) return
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault()
          move(event.key === 'ArrowDown' ? 1 : -1)
        }
      }}>
      <For each={local.options}>
        {(item) => {
          const selected = () => Object.is(item.value, local.selectedValue)
          return (
            <button
              ref={(element) => itemElements.set(item.value, element)}
              type="button"
              role="option"
              tabIndex={-1}
              disabled={isDisabled() || item.disabled}
              aria-selected={selected()}
              data-selected={selected() ? 'true' : undefined}
              data-disabled={item.disabled ? 'true' : undefined}
              class={timePickerColumnItemClassName}
              onFocus={() => {
                activeValue = item.value
              }}
              onClick={() => {
                if (isDisabled() || context.readOnly() || item.disabled) return
                activeValue = item.value
                local.onSelect(item.value)
                const itemElement = itemElements.get(item.value)
                if (listElement && itemElement)
                  listElement.scrollTo({ top: itemElement.offsetTop, behavior: 'smooth' })
              }}
            >
              {item.label}
            </button>
          )
        }}
      </For>
      <div aria-hidden="true" class={timePickerColumnSpacerClassName} />
      </ScrollbarViewport>
      <ScrollbarBar axis="y" />
    </ScrollbarRoot>
  )
}

export interface TimePickerNumericColumnProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  step?: number | undefined
  disabled?: boolean | undefined
  isItemDisabled?: ((value: number) => boolean) | undefined
}

export function TimePickerHourColumn(props: TimePickerNumericColumnProps) {
  const context = useTimePickerContext('TimePickerHourColumn')
  const options = createMemo(() =>
    createHourOptions({
      step: props.step,
      use12Hours: context.use12Hours(),
      period: context.snapshot().value ? getDisplayedPeriod(context.snapshot().value!) : 'am',
      disabled: resolveDisabledTime(context.disabledTime(), context.snapshot().value).hours,
    }).map((item) => ({
      ...item,
      disabled: item.disabled || Boolean(props.isItemDisabled?.(item.value)),
    })),
  )
  const selected = () =>
    context.snapshot().value
      ? getDisplayedHour(context.snapshot().value!, context.use12Hours())
      : undefined
  return (
    <TimePickerColumn
      {...props}
      options={options()}
      selectedValue={selected()}
      onSelect={(value) => context.controller.selectHour(Number(value), context.use12Hours())}
    />
  )
}

export function TimePickerMinuteColumn(props: TimePickerNumericColumnProps) {
  const context = useTimePickerContext('TimePickerMinuteColumn')
  const options = createMemo(() =>
    createMinuteOptions(
      props.step,
      resolveDisabledTime(context.disabledTime(), context.snapshot().value).minutes,
    ).map((item) => ({
      ...item,
      disabled: item.disabled || Boolean(props.isItemDisabled?.(item.value)),
    })),
  )
  return (
    <TimePickerColumn
      {...props}
      options={options()}
      selectedValue={context.snapshot().value?.minute}
      onSelect={(value) => context.controller.selectMinute(Number(value))}
    />
  )
}

export function TimePickerSecondColumn(props: TimePickerNumericColumnProps) {
  const context = useTimePickerContext('TimePickerSecondColumn')
  const options = createMemo(() =>
    createSecondOptions(
      props.step,
      resolveDisabledTime(context.disabledTime(), context.snapshot().value).seconds,
    ).map((item) => ({
      ...item,
      disabled: item.disabled || Boolean(props.isItemDisabled?.(item.value)),
    })),
  )
  return (
    <TimePickerColumn
      {...props}
      options={options()}
      selectedValue={context.snapshot().value?.second}
      onSelect={(value) => context.controller.selectSecond(Number(value))}
    />
  )
}

export interface TimePickerPeriodColumnProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  disabled?: boolean | undefined
  labels?: { am: string; pm: string } | undefined
  isItemDisabled?: ((value: TimePeriod) => boolean) | undefined
}

export function TimePickerPeriodColumn(props: TimePickerPeriodColumnProps) {
  const context = useTimePickerContext('TimePickerPeriodColumn')
  const options = createMemo(() =>
    createPeriodOptions(props.labels).map((item) => ({
      ...item,
      disabled: item.disabled || Boolean(props.isItemDisabled?.(item.value)),
    })),
  )
  const selected = () =>
    context.snapshot().value ? getDisplayedPeriod(context.snapshot().value!) : undefined
  return context.use12Hours() ? (
    <TimePickerColumn
      {...props}
      options={options()}
      selectedValue={selected()}
      onSelect={(value) => context.controller.selectPeriod(value as TimePeriod)}
    />
  ) : null
}

export function useTimePicker() {
  return useTimePickerContext('useTimePicker')
}

export type { DisabledTime, TimePeriod, TimePickerChangeDetails, TimeValue }
