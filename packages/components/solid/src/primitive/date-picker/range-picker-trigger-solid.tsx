import { getRangeInputPreviewValue } from '@fex/components-core/date-picker/range'
import { formatDatePickerValue, parseDatePickerValue } from '@fex/components-core/date-picker/value'
import {
  datePickerRangeInputClassName,
  datePickerRangeInputControlClassName,
  datePickerRangeSeparatorClassName,
  datePickerRangeTriggerClassName,
} from '@fex/components-styles/date-picker'
import { cn } from '@fex/utils'
import { createEffect, createSignal, splitProps, type JSX, type ParentProps } from 'solid-js'
import { CalendarIcon } from '../../icon/calendar'
import { InputClear, InputControl, InputRoot, InputSuffix, type InputRootProps } from '../input/input'
import { PopoverTrigger } from '../popover/popover'
import { useRangePickerContext } from './context'

export interface RangePickerTriggerProps
  extends ParentProps<Omit<InputRootProps, 'value' | 'defaultValue' | 'onValueChange' | 'onClear'>> {
  startPlaceholder?: string
  endPlaceholder?: string
  separator?: JSX.Element
  suffix?: JSX.Element
  inputProps?: JSX.InputHTMLAttributes<HTMLInputElement>
  startInputProps?: JSX.InputHTMLAttributes<HTMLInputElement>
  endInputProps?: JSX.InputHTMLAttributes<HTMLInputElement>
}

export function RangePickerTrigger(props: RangePickerTriggerProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'status',
    'startPlaceholder',
    'endPlaceholder',
    'separator',
    'suffix',
    'inputProps',
    'startInputProps',
    'endInputProps',
  ])
  const context = useRangePickerContext('RangePickerTrigger')
  const startValue = () => formatDatePickerValue(context.rangeValue().start ?? null, context)
  const endValue = () => formatDatePickerValue(context.rangeValue().end ?? null, context)
  const [startText, setStartText] = createSignal(startValue())
  const [endText, setEndText] = createSignal(endValue())
  const [focusedPart, setFocusedPart] = createSignal<'start' | 'end' | null>(null)
  createEffect(() => setStartText(startValue()))
  createEffect(() => setEndText(endValue()))
  createEffect(() => {
    if (!context.open()) setFocusedPart(null)
  })

  const previewStartValue = () =>
    getRangeInputPreviewValue(context.rangeValue(), context.hoverValue(), context.activePart(), 'start')
  const previewEndValue = () =>
    getRangeInputPreviewValue(context.rangeValue(), context.hoverValue(), context.activePart(), 'end')
  const previewStartText = () =>
    context.activePart() === 'start' && previewStartValue()
      ? formatDatePickerValue(previewStartValue(), context)
      : startText()
  const previewEndText = () =>
    context.activePart() === 'end' && previewEndValue()
      ? formatDatePickerValue(previewEndValue(), context)
      : endText()
  const hasValue = () => Boolean(startValue() || endValue())

  function input(part: 'start' | 'end', text: string) {
    if (part === 'start') setStartText(text)
    else setEndText(text)
    context.setActivePart(part)
    context.setHoverValue(null)
    const result = parseDatePickerValue(text, context)
    if (result.valid) context.select(result.value as never)
  }

  function focus(part: 'start' | 'end') {
    context.setActivePart(part)
    setFocusedPart(part)
    context.openPanel(part)
  }

  function clickInput(event: MouseEvent, part: 'start' | 'end') {
    event.stopPropagation()
    if (!context.disabled) focus(part)
  }

  return (
    <PopoverTrigger>
      {(trigger) => {
        const {
          onBlur: _triggerBlur,
          onClick: _triggerClick,
          onFocus: _triggerFocus,
          ...triggerProps
        } = trigger.props
        return (
          <InputRoot
            {...rest}
            {...(triggerProps as unknown as JSX.HTMLAttributes<HTMLDivElement>)}
            ref={trigger.ref as unknown as JSX.HTMLAttributes<HTMLDivElement>['ref']}
            class={cn(datePickerRangeTriggerClassName, local.class)}
            value=""
            disabled={context.disabled}
            readOnly={context.readOnly}
            status={local.status ?? context.status}
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
              rest.onBlur?.(event)
              if (!event.defaultPrevented && !event.currentTarget.contains(event.relatedTarget)) {
                setFocusedPart(null)
              }
            }}
          >
            <RangeInput
              part="start"
              value={previewStartText()}
              placeholder={local.startPlaceholder ?? '开始日期'}
              active={context.open() ? context.activePart() === 'start' : focusedPart() === 'start'}
              inputProps={local.startInputProps ?? local.inputProps}
              onClick={(event) => clickInput(event, 'start')}
              onFocus={() => focus('start')}
              onValueChange={(value) => input('start', value)}
              preview={previewStartText() !== startText()}
            />
            <span aria-hidden="true" class={datePickerRangeSeparatorClassName}>
              {local.separator ?? '→'}
            </span>
            <RangeInput
              part="end"
              value={previewEndText()}
              placeholder={local.endPlaceholder ?? '结束日期'}
              active={context.open() ? context.activePart() === 'end' : focusedPart() === 'end'}
              inputProps={local.endInputProps ?? local.inputProps}
              onClick={(event) => clickInput(event, 'end')}
              onFocus={() => focus('end')}
              onValueChange={(value) => input('end', value)}
              preview={previewEndText() !== endText()}
            />
            {context.allowClear && hasValue() ? (
              <InputClear
                forceMount
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation()
                  context.clear()
                }}
              />
            ) : (
              <InputSuffix>{local.suffix ?? <CalendarIcon class="size-4" />}</InputSuffix>
            )}
          </InputRoot>
        )
      }}
    </PopoverTrigger>
  )
}

function RangeInput(props: {
  part: 'start' | 'end'
  value: string
  placeholder: string
  active: boolean
  inputProps?: JSX.InputHTMLAttributes<HTMLInputElement>
  onClick: JSX.EventHandlerUnion<HTMLInputElement, MouseEvent>
  onFocus: JSX.FocusEventHandlerUnion<HTMLInputElement, FocusEvent>
  onValueChange: (value: string) => void
  preview?: boolean
}) {
  return (
    <InputRoot
      value={props.value}
      disabled={props.inputProps?.disabled}
      readOnly={props.inputProps?.readOnly}
      onValueChange={props.onValueChange}
      data-range-part={props.part}
      data-active={props.active ? 'true' : undefined}
      class={datePickerRangeInputClassName}
    >
      <InputControl
        {...props.inputProps}
        class={cn(
          datePickerRangeInputControlClassName,
          props.preview && 'text-muted-foreground',
          props.inputProps?.class,
        )}
        placeholder={props.placeholder}
        onClick={(event) => {
          props.inputProps?.onClick?.(event)
          if (!event.defaultPrevented) props.onClick(event)
        }}
        onFocus={(event) => {
          props.inputProps?.onFocus?.(event)
          props.onFocus(event)
        }}
      />
    </InputRoot>
  )
}
