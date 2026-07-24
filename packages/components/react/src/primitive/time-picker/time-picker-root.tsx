import type { DisabledTime, TimePickerControllerOptions } from '@fex/components-core/time-picker/types'
import type { ReactNode } from 'react'
import { PopoverRoot, type PopoverRootProps } from '../popover/popover'
import { TimePickerContext } from './time-picker-context'
import { useTimePicker } from './use-time-picker'

export interface TimePickerRootProps
  extends Omit<PopoverRootProps, 'defaultOpen' | 'onOpenChange'>,
    TimePickerControllerOptions {
  format?: string | undefined
  use12Hours?: boolean | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  disabledTime?: DisabledTime | undefined
  defaultOpen?: boolean | undefined
  onOpenChange?: PopoverRootProps['onOpenChange']
  children?: ReactNode
}

export function TimePickerRoot({
  value,
  defaultValue,
  onChange,
  format,
  use12Hours = false,
  disabled = false,
  readOnly = false,
  disabledTime,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}: TimePickerRootProps) {
  const timePicker = useTimePicker({ value, defaultValue, onChange })
  const resolvedFormat = format ?? (use12Hours ? 'hh:mm:ss A' : 'HH:mm:ss')
  return (
    <PopoverRoot {...props} defaultOpen={defaultOpen} onOpenChange={onOpenChange} trigger={['focus', 'click']}>
      <TimePickerContext value={{ ...timePicker, format: resolvedFormat, use12Hours, disabled, readOnly, disabledTime }}>
        {children}
      </TimePickerContext>
    </PopoverRoot>
  )
}
