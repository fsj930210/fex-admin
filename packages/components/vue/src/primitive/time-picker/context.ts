import type { DisabledTime, TimePickerController, TimePickerSnapshot } from '@fex/components-core/time-picker/types'
import type { ComputedRef, InjectionKey } from 'vue'

export interface TimePickerContext {
  controller: TimePickerController
  snapshot: ComputedRef<TimePickerSnapshot>
  format: ComputedRef<string>
  use12Hours: ComputedRef<boolean>
  disabled: ComputedRef<boolean>
  readOnly: ComputedRef<boolean>
  disabledTime: ComputedRef<DisabledTime | undefined>
}

export const timePickerContextKey: InjectionKey<TimePickerContext> = Symbol('TimePicker')
