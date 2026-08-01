import { formatDatePickerValue } from '@fex/components-core/date-picker/value'
import {
  datePickerTagClassName,
  datePickerTagOverflowClassName,
  datePickerTagRemoveClassName,
} from '@fex/components-styles/date-picker'
import { cn } from '@fex/utils'
import type { ComponentProps, MouseEvent } from 'react'
import { CloseIcon } from '../../icon/close'
import { useDatePickerContext } from './context'

export interface DatePickerTagsProps extends ComponentProps<'div'> {
  maxVisible?: number
}

export function DatePickerTags({ className, maxVisible = 1, ...props }: DatePickerTagsProps) {
  const context = useDatePickerContext('DatePickerTags')
  const values = Array.isArray(context.value) ? context.value : []
  if (!values.length) return null
  const labels = values.map((value) => formatDatePickerValue(value, context))
  const visibleValues = values.slice(0, maxVisible)
  const hiddenCount = values.length - visibleValues.length
  return (
    <div
      {...props}
      data-slot="date-picker-tags"
      className={cn('flex shrink items-center gap-1', className)}
    >
      {visibleValues.map((value) => {
        const label = formatDatePickerValue(value, context)
        return <DatePickerTag key={label} value={label} onRemove={() => context.select(value)} />
      })}
      {hiddenCount > 0 ? (
        <span
          data-slot="date-picker-tag-overflow"
          title={labels.join(', ')}
          className={datePickerTagOverflowClassName}
        >
          +{hiddenCount}
        </span>
      ) : null}
    </div>
  )
}

export interface DatePickerTagProps extends ComponentProps<'span'> {
  value: string
  onRemove?: () => void
}

export function DatePickerTag({ value, className, onRemove, ...props }: DatePickerTagProps) {
  return (
    <span {...props} data-slot="date-picker-tag" className={cn(datePickerTagClassName, className)}>
      {value}
      {onRemove ? (
        <button
          type="button"
          aria-label={`移除 ${value}`}
          className={datePickerTagRemoveClassName}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event: MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation()
            onRemove()
          }}
        >
          <CloseIcon />
        </button>
      ) : null}
    </span>
  )
}
