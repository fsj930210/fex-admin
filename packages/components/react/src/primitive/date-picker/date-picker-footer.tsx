import { cn } from '@fex/utils'
import { getCalendarToday } from '@fex/components-core/calendar'
import { getDefaultPanelByPicker } from '@fex/components-core/date-picker/panel'
import {
  datePickerCancelClassName,
  datePickerConfirmClassName,
  datePickerFooterClassName,
  datePickerPresetClassName,
  datePickerTodayClassName,
} from '@fex/components-styles/date-picker'
import { use, type ComponentProps, type ReactNode } from 'react'
import { DatePickerContext, RangePickerContext } from './context'
import { Button } from '../button/button'

function useFooterOwner() {
  const datePicker = use(DatePickerContext)
  const rangePicker = use(RangePickerContext)
  const context = datePicker ?? rangePicker
  if (!context)
    throw new Error('DatePickerFooter must be used within DatePickerRoot or RangePickerRoot')
  return context
}

export interface DatePickerFooterProps extends Omit<ComponentProps<'div'>, 'children'> {
  children?:
    | ReactNode
    | ((actions: {
        close: () => void
        clear: () => void
        confirm: () => void
        cancel: () => void
      }) => ReactNode)
}

export function DatePickerFooter({ className, children, ...props }: DatePickerFooterProps) {
  const context = useFooterOwner()
  const actions = {
    close: context.close,
    clear: context.clear,
    confirm: context.confirm,
    cancel: context.cancel,
  }
  return (
    <div
      {...props}
      data-slot="date-picker-footer"
      className={cn(datePickerFooterClassName, className)}
    >
      {typeof children === 'function' ? children(actions) : children}
    </div>
  )
}

export interface DatePickerConfirmProps extends ComponentProps<'button'> {}

export function DatePickerConfirm({
  className,
  children = '确定',
  onClick,
  ...props
}: DatePickerConfirmProps) {
  const context = useFooterOwner()
  return (
    <Button
      {...props}
      type="button"
      data-slot="date-picker-confirm"
      className={cn(datePickerConfirmClassName, className)}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) context.confirm()
      }}
    >
      {children}
    </Button>
  )
}

export function DatePickerCancel({
  className,
  children = '取消',
  onClick,
  ...props
}: DatePickerConfirmProps) {
  const context = useFooterOwner()
  return (
    <Button
      {...props}
      type="button"
      data-slot="date-picker-cancel"
      className={cn(datePickerCancelClassName, className)}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) context.cancel()
      }}
    >
      {children}
    </Button>
  )
}

export function DatePickerPreset({
  className,
  children,
  onClick,
  ...props
}: DatePickerConfirmProps) {
  return (
    <Button
      {...props}
      type="button"
      data-slot="date-picker-preset"
      className={cn(datePickerPresetClassName, className)}
      onClick={(event) => {
        onClick?.(event)
      }}
    >
      {children}
    </Button>
  )
}

export interface DatePickerTodayProps extends ComponentProps<'button'> {}

export function DatePickerToday({
  className,
  children = '今天',
  onClick,
  ...props
}: DatePickerTodayProps) {
  const context = useFooterOwner()
  return (
    <Button
      {...props}
      type="button"
      data-slot="date-picker-today"
      className={cn(datePickerTodayClassName, className)}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        context.setViewDate(getCalendarToday())
        context.setPanel(getDefaultPanelByPicker(context.picker))
      }}
    >
      {children}
    </Button>
  )
}
