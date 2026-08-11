import { formatDatePickerValue } from '@fex-design/core/date-picker/value'
import { cn } from '@fex/utils'
import type { ComponentProps } from 'react'
import { Tag } from '../tag/tag'
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
        <Tag data-slot="date-picker-tag-overflow" size="sm" title={labels.join(', ')}>
          +{hiddenCount}
        </Tag>
      ) : null}
    </div>
  )
}

export interface DatePickerTagProps extends Omit<ComponentProps<'span'>, 'onClose'> {
  value: string
  onRemove?: () => void
}

export function DatePickerTag({ value, className, onRemove, ...props }: DatePickerTagProps) {
  return <Tag {...props} data-slot="date-picker-tag" size="sm" closable={Boolean(onRemove)} className={className} onPointerDownCapture={(event) => event.stopPropagation()} onClose={(event) => { event.stopPropagation(); onRemove?.() }}>{value}</Tag>
}
