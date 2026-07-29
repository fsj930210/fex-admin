import { formatDatePickerValue, parseDatePickerValue } from '@fex/components-core/date-picker/value'
import { datePickerMultipleInputClassName, datePickerMultipleTagsClassName, datePickerTriggerClassName } from '@fex/components-styles/date-picker'
import type { CalendarValue } from '@fex/components-core/calendar'
import { CalendarIcon } from '../../icon/calendar'
import { cn } from '@fex/utils'
import useUpdateEffect from '../../hooks/use-update-effect'
import {
  InputClear,
  InputControl,
  InputPrefix,
  InputRoot,
  InputSuffix,
  type InputRootProps,
} from '../input/input'
import { PopoverTrigger } from '../popover/popover'
import { useRef, useState, type ComponentProps, type ReactNode } from 'react'
import { useDatePickerContext } from './context'
import { DatePickerTags } from './date-picker-tags'

export interface DatePickerTriggerProps
  extends Omit<InputRootProps, 'value' | 'defaultValue' | 'onValueChange' | 'onClear' | 'children' | 'prefix'> {
  placeholder?: string | undefined
  prefix?: ReactNode
  suffix?: ReactNode
  inputProps?: Omit<ComponentProps<typeof InputControl>, 'value' | 'defaultValue'> | undefined
}

export function DatePickerTrigger({ placeholder, prefix, suffix, inputProps, className, ...props }: DatePickerTriggerProps) {
  const context = useDatePickerContext('DatePickerTrigger')
  const inputRef = useRef<HTMLInputElement>(null)
  const displayValue = isCalendarValueArray(context.value)
    ? context.value.map((item) => formatDatePickerValue(item, context)).join(', ')
    : formatDatePickerValue(context.value ?? null, context)
  const [text, setText] = useState(displayValue)

  useUpdateEffect(() => setText(displayValue), [displayValue])

  function input(nextText: string) {
    setText(nextText)
    if (context.multiple) return
    const result = parseDatePickerValue(nextText, context)
    if (result.valid) context.select(result.value)
  }

  return (
    <PopoverTrigger>
      {(triggerProps) => {
        const { onClick, onFocus, ...popoverProps } = triggerProps
        return (
          <InputRoot
          {...props}
          {...(popoverProps as ComponentProps<typeof InputRoot>)}
          className={cn(datePickerTriggerClassName, className)}
          role={undefined}
          value={context.multiple ? '' : text}
          disabled={context.disabled}
          readOnly={context.readOnly}
          onValueChange={input}
          onClear={context.allowClear ? context.clear : undefined}
          onClick={(event) => {
            if (context.disabled) {
              event.preventDefault()
              event.stopPropagation()
              return
            }
            inputRef.current?.focus()
            onClick?.(event as never)
          }}
          onFocus={(event) => {
            if (context.disabled) {
              event.preventDefault()
              return
            }
            onFocus?.(event as never)
          }}
        >
          {prefix ? <InputPrefix>{prefix}</InputPrefix> : null}
          {context.multiple ? <DatePickerTags className={datePickerMultipleTagsClassName} /> : null}
          <InputControl
            {...inputProps}
            ref={inputRef}
            className={cn(context.multiple && displayValue && datePickerMultipleInputClassName, inputProps?.className)}
            placeholder={context.multiple && displayValue ? '' : placeholder ?? context.format}
          />
          {context.allowClear ? (
            <InputClear
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
            />
          ) : null}
          {!context.allowClear || !displayValue ? <InputSuffix>{suffix ?? <CalendarIcon className="size-4" />}</InputSuffix> : null}
        </InputRoot>
        )
      }}
    </PopoverTrigger>
  )
}

function isCalendarValueArray(value: unknown): value is readonly CalendarValue[] {
  return Array.isArray(value)
}
