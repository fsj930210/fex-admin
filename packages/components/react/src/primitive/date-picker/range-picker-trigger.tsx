import { getRangePickerDisplayTexts } from '@fex/components-core/date-picker/input'
import { getRangeInputPreviewValue } from '@fex/components-core/date-picker/range'
import { formatDatePickerValue, parseDatePickerValue } from '@fex/components-core/date-picker/value'
import { datePickerRangeInputClassName, datePickerRangeInputControlClassName, datePickerRangeSeparatorClassName, datePickerRangeTriggerClassName } from '@fex/components-styles/date-picker'
import { CalendarIcon } from '../../icon/calendar'
import { cn } from '@fex/utils'
import useUpdateEffect from '../../hooks/use-update-effect'
import {
  InputClearButton,
  InputControl,
  InputRoot,
  InputSuffix,
  type InputControlProps,
  type InputRootProps,
} from '../input/input'
import { PopoverTrigger } from '../popover/popover'
import { useState, type ComponentProps, type ReactNode } from 'react'
import { useRangePickerContext } from './context'

export interface RangePickerTriggerProps
  extends Omit<InputRootProps, 'value' | 'defaultValue' | 'onValueChange' | 'onClear' | 'children'> {
  startPlaceholder?: string | undefined
  endPlaceholder?: string | undefined
  separator?: ReactNode
  suffix?: ReactNode
  inputProps?: Omit<InputControlProps, 'value' | 'defaultValue'> | undefined
  startInputProps?: Omit<InputControlProps, 'value' | 'defaultValue'> | undefined
  endInputProps?: Omit<InputControlProps, 'value' | 'defaultValue'> | undefined
}

export function RangePickerTrigger({
  startPlaceholder = '开始日期',
  endPlaceholder = '结束日期',
  separator = '→',
  suffix,
  inputProps,
  startInputProps,
  endInputProps,
  className,
  status,
  ...props
}: RangePickerTriggerProps) {
  const context = useRangePickerContext('RangePickerTrigger')
  const [startValue, endValue] = getRangePickerDisplayTexts(context.rangeValue, context)
  const [startText, setStartText] = useState(startValue)
  const [endText, setEndText] = useState(endValue)
  const [focusedPart, setFocusedPart] = useState<'start' | 'end' | null>(null)
  const previewStartValue = getRangeInputPreviewValue(context.rangeValue, context.hoverValue, context.activePart, 'start')
  const previewEndValue = getRangeInputPreviewValue(context.rangeValue, context.hoverValue, context.activePart, 'end')
  const previewStartText = context.activePart === 'start' && previewStartValue
    ? formatDatePickerValue(previewStartValue, context)
    : startText
  const previewEndText = context.activePart === 'end' && previewEndValue
    ? formatDatePickerValue(previewEndValue, context)
    : endText
  const hasValue = Boolean(startValue || endValue)

  useUpdateEffect(() => setStartText(startValue), [startValue])
  useUpdateEffect(() => setEndText(endValue), [endValue])

  function input(part: 'start' | 'end', text: string) {
    if (part === 'start') setStartText(text)
    else setEndText(text)
    context.setActivePart(part)
    context.setHoverValue(null)
    const result = parseDatePickerValue(text, context)
    if (result.valid) context.select(result.value)
  }

  return (
    <PopoverTrigger>
      {(triggerProps) => {
        const {
          onBlur: _triggerBlur,
          onClick: _triggerClick,
          onFocus: _triggerFocus,
          ...popoverProps
        } = triggerProps
        return (
          <InputRoot
            {...props}
            {...(popoverProps as ComponentProps<typeof InputRoot>)}
            className={cn(datePickerRangeTriggerClassName, className)}
            value=""
            disabled={context.disabled}
            readOnly={context.readOnly}
            status={status ?? context.status}
            onValueChange={() => undefined}
            onClick={(event) => {
              if (context.disabled) {
                event.preventDefault()
                event.stopPropagation()
                return
              }
              const part = (event.target as HTMLElement).closest('[data-range-part]')?.getAttribute('data-range-part')
              context.openPanel(part === 'start' || part === 'end' ? part : undefined)
            }}
            onBlur={(event) => {
              props.onBlur?.(event)
              if (!event.defaultPrevented && !event.currentTarget.contains(event.relatedTarget)) {
                setFocusedPart(null)
              }
            }}
          >
            <RangeInput
              part="start"
              value={previewStartText}
              placeholder={startPlaceholder}
              active={context.open ? context.activePart === 'start' : focusedPart === 'start'}
              inputProps={startInputProps ?? inputProps}
              onFocus={() => {
                context.setActivePart('start')
                setFocusedPart('start')
                context.openPanel('start')
              }}
              onValueChange={(value) => input('start', value)}
              preview={previewStartText !== startText}
            />
            <span aria-hidden="true" className={datePickerRangeSeparatorClassName}>{separator}</span>
            <RangeInput
              part="end"
              value={previewEndText}
              placeholder={endPlaceholder}
              active={context.open ? context.activePart === 'end' : focusedPart === 'end'}
              inputProps={endInputProps ?? inputProps}
              onFocus={() => {
                context.setActivePart('end')
                setFocusedPart('end')
                context.openPanel('end')
              }}
              onValueChange={(value) => input('end', value)}
              preview={previewEndText !== endText}
            />
            {context.allowClear && hasValue ? (
              <InputClearButton
                aria-label="清除日期范围"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation()
                  context.clear()
                }}
              />
            ) : (
              <InputSuffix>{suffix ?? <CalendarIcon className="size-4" />}</InputSuffix>
            )}
          </InputRoot>
        )
      }}
    </PopoverTrigger>
  )
}

function RangeInput({
  part,
  value,
  placeholder,
  active,
  inputProps,
  onFocus,
  onValueChange,
  preview = false,
}: {
  part: 'start' | 'end'
  value: string
  placeholder: string
  active: boolean
  inputProps?: Omit<InputControlProps, 'value' | 'defaultValue'> | undefined
  onFocus: NonNullable<InputControlProps['onFocus']>
  onValueChange: (value: string) => void
  preview?: boolean
}) {
  return (
    <InputRoot
      value={value}
      disabled={inputProps?.disabled}
      readOnly={inputProps?.readOnly}
      onValueChange={onValueChange}
      data-range-part={part}
      data-active={active ? 'true' : undefined}
      className={datePickerRangeInputClassName}
    >
      <InputControl
        {...inputProps}
        className={cn(datePickerRangeInputControlClassName, preview && 'text-muted-foreground', inputProps?.className)}
        placeholder={placeholder}
        onFocus={(event) => {
          inputProps?.onFocus?.(event)
          onFocus(event)
        }}
      />
    </InputRoot>
  )
}
