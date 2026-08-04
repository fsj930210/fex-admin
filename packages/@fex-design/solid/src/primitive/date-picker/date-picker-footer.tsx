import { getCalendarToday } from '@fex-design/core/calendar'
import { getDefaultPanelByPicker } from '@fex-design/core/date-picker/panel'
import {
  datePickerCancelClassName,
  datePickerConfirmClassName,
  datePickerFooterClassName,
  datePickerPresetClassName,
  datePickerTodayClassName,
} from '@fex-design/styles/date-picker'
import { cn } from '@fex/utils'
import { splitProps, useContext, type JSX } from 'solid-js'
import Button, { type ButtonProps } from '../button/button'
import { DatePickerContext, RangePickerContext } from './context'

function useFooterOwner() {
  const datePicker = useContext(DatePickerContext)
  const rangePicker = useContext(RangePickerContext)
  const context = datePicker ?? rangePicker
  if (!context)
    throw new Error('DatePickerFooter must be used within DatePickerRoot or RangePickerRoot')
  return context
}

export interface DatePickerFooterProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  children?:
    | JSX.Element
    | ((actions: {
        close: () => void
        clear: () => void
        confirm: () => void
        cancel: () => void
      }) => JSX.Element)
}

export function DatePickerFooter(props: DatePickerFooterProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const picker = useFooterOwner()
  const actions = {
    close: picker.close,
    clear: picker.clear,
    confirm: picker.confirm,
    cancel: picker.cancel,
  }
  return (
    <div {...rest} class={cn(datePickerFooterClassName, local.class)}>
      {typeof local.children === 'function' ? local.children(actions) : local.children}
    </div>
  )
}

export function DatePickerConfirm(props: ButtonProps) {
  const picker = useFooterOwner()
  const [local, rest] = splitProps(props, ['class', 'onClick'])
  return (
    <Button
      {...rest}
      data-slot="date-picker-confirm"
      class={cn(datePickerConfirmClassName, local.class)}
      onClick={(event) => {
        if (typeof local.onClick === 'function') local.onClick(event)
        if (!event.defaultPrevented) picker.confirm()
      }}
    />
  )
}

export function DatePickerCancel(props: ButtonProps) {
  const picker = useFooterOwner()
  const [local, rest] = splitProps(props, ['class', 'onClick'])
  return (
    <Button
      {...rest}
      data-slot="date-picker-cancel"
      class={cn(datePickerCancelClassName, local.class)}
      onClick={(event) => {
        if (typeof local.onClick === 'function') local.onClick(event)
        if (!event.defaultPrevented) picker.cancel()
      }}
    />
  )
}

export function DatePickerToday(props: ButtonProps) {
  const picker = useFooterOwner()
  const [local, rest] = splitProps(props, ['class', 'onClick'])
  return (
    <Button
      {...rest}
      data-slot="date-picker-today"
      class={cn(datePickerTodayClassName, local.class)}
      onClick={(event) => {
        if (typeof local.onClick === 'function') local.onClick(event)
        if (!event.defaultPrevented) {
          picker.setViewDate(getCalendarToday())
          picker.setPanel(getDefaultPanelByPicker(picker.picker))
        }
      }}
    />
  )
}

export function DatePickerPreset(props: ButtonProps) {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <Button
      {...rest}
      data-slot="date-picker-preset"
      class={cn(datePickerPresetClassName, local.class)}
    />
  )
}
