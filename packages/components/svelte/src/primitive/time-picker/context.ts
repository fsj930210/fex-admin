import type { DisabledTime, TimePickerController, TimePickerSnapshot } from '@fex/components-core/time-picker/types'

export const timePickerContextKey = Symbol('TimePicker')
export interface TimePickerContext {
  controller: TimePickerController
  snapshot: () => TimePickerSnapshot
  format: () => string
  use12Hours: () => boolean
  disabled: () => boolean
  readOnly: () => boolean
  disabledTime: () => DisabledTime | undefined
}
