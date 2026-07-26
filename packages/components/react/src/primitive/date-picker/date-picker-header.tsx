import {
  getDatePickerHeaderLabelParts,
  getNextPanelByHeaderLabel,
  getNextViewDateByHeaderAction,
} from '@fex/components-core/date-picker/panel'
import type { DatePickerHeaderAction, DatePickerHeaderLabelPart } from '@fex/components-core/date-picker/types'
import { datePickerHeaderClassName, datePickerHeaderLabelClassName } from '@fex/components-styles/date-picker'
import { cn } from '@fex/utils'
import { use, useState, type ComponentProps, type ReactNode } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '../../icon/chevron'
import { Button } from '../button/button'
import { useCalendarContext } from '../calendar/calendar-context'
import { DatePickerContext, RangePickerContext } from './context'

function useHeaderOwner() {
  const datePicker = use(DatePickerContext)
  const rangePicker = use(RangePickerContext)
  const context = datePicker ?? rangePicker
  if (!context) throw new Error('DatePickerHeader must be used within DatePickerRoot or RangePickerRoot')
  return context
}

export interface DatePickerHeaderProps extends ComponentProps<'div'> {}

export function DatePickerHeader({ className, ...props }: DatePickerHeaderProps) {
  return (
    <div
      {...props}
      data-slot="date-picker-header"
      className={cn(datePickerHeaderClassName, className)}
    />
  )
}

export interface DatePickerHeaderButtonProps extends ComponentProps<'button'> {
  action: DatePickerHeaderAction
}

export function DatePickerHeaderButton({
  action,
  className,
  children,
  onClick,
  ...props
}: DatePickerHeaderButtonProps) {
  const context = useHeaderOwner()
  const calendar = useCalendarContext('DatePickerHeaderButton')
  const isPrevious = action.startsWith('previous')
  const icon = children ?? (
    <span className="flex items-center">
      {action.includes('year') || action.includes('panel') ? (
        <>
          {isPrevious ? <ChevronLeftIcon className="size-4" /> : <ChevronRightIcon className="size-4" />}
          {isPrevious ? <ChevronLeftIcon className="-ml-2 size-4" /> : <ChevronRightIcon className="-ml-2 size-4" />}
        </>
      ) : isPrevious ? (
        <ChevronLeftIcon className="size-4" />
      ) : (
        <ChevronRightIcon className="size-4" />
      )}
    </span>
  )

  return (
    <Button
      {...props}
      type="button"
      data-slot="date-picker-header-button"
      data-action={action}
      className={cn('inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted-background hover:text-foreground', className)}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        const nextViewDate = getNextViewDateByHeaderAction(calendar.viewDate, action, calendar.panel)
        calendar.setViewDate(nextViewDate)
        context.setViewDate(nextViewDate)
      }}
    >
      {icon}
    </Button>
  )
}

export interface DatePickerHeaderTitleProps extends ComponentProps<'div'> {
  children?: ReactNode
}

export function DatePickerHeaderTitle({ className, ...props }: DatePickerHeaderTitleProps) {
  return <div {...props} data-slot="date-picker-header-title" className={cn('flex items-center gap-2 text-base font-semibold', className)} />
}

export interface DatePickerHeaderLabelProps extends Omit<ComponentProps<'button'>, 'children'> {
  part: DatePickerHeaderLabelPart
  children?: ReactNode
}

export function DatePickerHeaderLabel({
  part,
  className,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...props
}: DatePickerHeaderLabelProps) {
  const context = useHeaderOwner()
  const calendar = useCalendarContext('DatePickerHeaderLabel')
  const [hovered, setHovered] = useState(false)
  const visible = getDatePickerHeaderLabelParts(context.picker, calendar.panel).includes(part)
  if (!visible) return null
  const decadeStart = Math.floor(calendar.viewDate.year / 10) * 10
  const label = children ?? (part === 'year'
    ? calendar.panel === 'decade'
      ? `${decadeStart}-${decadeStart + 9}年`
      : `${calendar.viewDate.year}年`
    : `${calendar.viewDate.month}月`)

  return (
    <Button
      {...props}
      type="button"
      data-slot="date-picker-header-label"
      data-part={part}
      data-hovered={hovered ? 'true' : undefined}
      className={cn(datePickerHeaderLabelClassName, className)}
      onMouseEnter={(event) => {
        setHovered(true)
        onMouseEnter?.(event)
      }}
      onMouseLeave={(event) => {
        setHovered(false)
        onMouseLeave?.(event)
      }}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        const nextPanel = getNextPanelByHeaderLabel(part)
        calendar.setPanel(nextPanel)
        context.setPanel(nextPanel)
      }}
    >
      {label}
    </Button>
  )
}
