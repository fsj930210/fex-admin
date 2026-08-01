import { formatDatePickerValue, parseDatePickerValue } from '@fex/components-core/date-picker/value'
import {
  datePickerMultipleInputClassName,
  datePickerMultipleTagsClassName,
  datePickerTriggerClassName,
} from '@fex/components-styles/date-picker'
import { cn } from '@fex/utils'
import { createEffect, createSignal, splitProps, type JSX, type ParentProps } from 'solid-js'
import { CalendarIcon } from '../../icon/calendar'
import {
  InputClear,
  InputControl,
  InputPrefix,
  InputRoot,
  InputSuffix,
  type InputRootProps,
} from '../input/input'
import { PopoverTrigger } from '../popover/popover'
import { useDatePickerContext } from './context'
import { DatePickerTags } from './date-picker-tags'

export interface DatePickerTriggerProps extends ParentProps<
  Omit<InputRootProps, 'value' | 'defaultValue' | 'onValueChange' | 'onClear' | 'prefix'>
> {
  displayValue?: string
  placeholder?: string
  prefix?: JSX.Element
  suffix?: JSX.Element
  inputProps?: JSX.InputHTMLAttributes<HTMLInputElement>
}

function isValueArray(value: unknown): value is readonly unknown[] {
  return Array.isArray(value)
}

export function DatePickerTrigger(props: DatePickerTriggerProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'displayValue',
    'placeholder',
    'prefix',
    'suffix',
    'status',
    'inputProps',
  ])
  const context = useDatePickerContext('DatePickerTrigger')
  let inputElement: HTMLInputElement | undefined
  const pickerDisplayValue = () => {
    const value = context.value()
    return isValueArray(value)
      ? value.map((item) => formatDatePickerValue(item as never, context)).join(', ')
      : formatDatePickerValue(value as never, context)
  }
  const displayValue = () => local.displayValue ?? pickerDisplayValue()
  const [text, setText] = createSignal(displayValue())
  createEffect(() => setText(displayValue()))

  function input(nextText: string) {
    setText(nextText)
    if (context.multiple) return
    const result = parseDatePickerValue(nextText, context)
    if (result.valid) context.select(result.value as never)
  }

  return (
    <PopoverTrigger>
      {(trigger) => {
        const { onClick, onFocus, ...triggerProps } = trigger.props
        return (
          <InputRoot
            {...rest}
            {...(triggerProps as unknown as JSX.HTMLAttributes<HTMLDivElement>)}
            ref={trigger.ref as unknown as JSX.HTMLAttributes<HTMLDivElement>['ref']}
            class={cn(datePickerTriggerClassName, local.class)}
            role={undefined}
            value={context.multiple ? '' : text()}
            disabled={context.disabled}
            readOnly={context.readOnly}
            status={local.status ?? context.status}
            onValueChange={input}
            onClear={context.allowClear ? context.clear : undefined}
            onClick={(event) => {
              if (context.disabled) {
                event.preventDefault()
                event.stopPropagation()
                return
              }
              inputElement?.focus()
              if (typeof onClick === 'function') onClick(event as never)
            }}
            onFocus={(event) => {
              if (context.disabled) {
                event.preventDefault()
                return
              }
              if (typeof onFocus === 'function') onFocus(event as never)
            }}
          >
            {local.prefix ? <InputPrefix>{local.prefix}</InputPrefix> : null}
            {context.multiple ? <DatePickerTags class={datePickerMultipleTagsClassName} /> : null}
            <InputControl
              {...local.inputProps}
              ref={(element) => {
                inputElement = element
                const ref = local.inputProps?.ref
                if (typeof ref === 'function') ref(element)
              }}
              class={cn(
                context.multiple && displayValue() && datePickerMultipleInputClassName,
                local.inputProps?.class,
              )}
              placeholder={
                context.multiple && displayValue() ? '' : (local.placeholder ?? context.format)
              }
            />
            {context.allowClear ? (
              <InputClear
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => event.stopPropagation()}
              />
            ) : null}
            {!context.allowClear || !displayValue() ? (
              <InputSuffix>{local.suffix ?? <CalendarIcon class="size-4" />}</InputSuffix>
            ) : null}
          </InputRoot>
        )
      }}
    </PopoverTrigger>
  )
}
