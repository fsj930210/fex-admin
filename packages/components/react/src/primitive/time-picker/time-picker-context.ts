import type { DisabledTime } from '@fex/components-core/time-picker/types'
import { createContext, use } from 'react'
import type { useTimePicker } from './use-time-picker'

export interface TimePickerContextValue extends ReturnType<typeof useTimePicker> {
  format: string
  use12Hours: boolean
  disabled: boolean
  readOnly: boolean
  disabledTime?: DisabledTime | undefined
}

export const TimePickerContext = createContext<TimePickerContextValue | null>(null)

export function useTimePickerContext(component: string): TimePickerContextValue {
  const context = use(TimePickerContext)
  if (!context) throw new Error(`${component} must be used inside TimePickerRoot.`)
  return context
}
