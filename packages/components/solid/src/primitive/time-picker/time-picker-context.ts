import type { DisabledTime, TimePickerController, TimePickerSnapshot } from '@fex/components-core/time-picker/types'
import { createContext, useContext, type Accessor } from 'solid-js'

export interface TimePickerContextValue {
  controller: TimePickerController
  snapshot: Accessor<TimePickerSnapshot>
  format: Accessor<string>
  use12Hours: Accessor<boolean>
  disabled: Accessor<boolean>
  readOnly: Accessor<boolean>
  disabledTime: Accessor<DisabledTime | undefined>
}

export const TimePickerContext = createContext<TimePickerContextValue>()
export function useTimePickerContext(component: string) {
  const context = useContext(TimePickerContext)
  if (!context) throw new Error(`${component} must be used inside TimePickerRoot.`)
  return context
}
