import { createTimePickerController } from '@fex/components-core/time-picker/create-time-picker-controller'
import type { TimePickerControllerOptions } from '@fex/components-core/time-picker/types'
import { computed, watch, type Ref } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'

export function useTimePicker(options: TimePickerControllerOptions, controlledValue?: Ref) {
  const controller = createTimePickerController(options)
  const storeSnapshot = useCoreStore(controller)
  const snapshot = computed(() => storeSnapshot.value)
  if (controlledValue) {
    // Controlled props are an external state boundary; keep the core controller in sync.
    watch(controlledValue, value => controller.setControlledValue(value), { immediate: true })
  }
  return { controller, snapshot }
}
