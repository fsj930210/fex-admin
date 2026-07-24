import { format as formatDate, parse } from '@fex/components-core/date/utils'
import { ClockIcon } from '../../icon/clock'
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
import { useState, type ComponentProps, type ReactNode } from 'react'
import { useTimePickerContext } from './time-picker-context'

export interface TimePickerTriggerProps
  extends Omit<InputRootProps, 'value' | 'defaultValue' | 'onValueChange' | 'onClear' | 'children' | 'prefix'> {
  allowClear?: boolean | undefined
  placeholder?: string | undefined
  prefix?: ReactNode
  suffix?: ReactNode
  inputProps?: Omit<ComponentProps<typeof InputControl>, 'value' | 'defaultValue'> | undefined
}

export function TimePickerTrigger({
  allowClear = true,
  placeholder,
  prefix,
  suffix,
  inputProps,
  ...props
}: TimePickerTriggerProps) {
  const context = useTimePickerContext('TimePickerTrigger')
  const formattedValue = context.snapshot.value
    ? formatDate(context.snapshot.value, context.format)
    : ''
  const [text, setText] = useState(formattedValue)

  useUpdateEffect(() => setText(formattedValue), [formattedValue])

  function input(next: string) {
    setText(next)
    const result = parse(next, context.format)
    if (result.valid) context.controller.change(result.value, 'input', 'smooth')
  }

  function clear() {
    setText('')
    context.controller.clear()
  }

  return (
    <PopoverTrigger>
      {(triggerProps) => (
        <InputRoot
          {...props}
          {...(triggerProps as ComponentProps<typeof InputRoot>)}
          role={undefined}
          value={text}
          disabled={context.disabled}
          readOnly={context.readOnly}
          onValueChange={input}
          onClear={allowClear ? clear : undefined}
        >
          {prefix ? <InputPrefix>{prefix}</InputPrefix> : null}
          <InputControl {...inputProps} placeholder={placeholder ?? context.format} />
          {allowClear ? <InputClear /> : null}
          {!allowClear || !text ? <InputSuffix>{suffix ?? <ClockIcon className="size-4" />}</InputSuffix> : null}
        </InputRoot>
      )}
    </PopoverTrigger>
  )
}
