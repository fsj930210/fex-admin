import { createTimePickerController } from '@fex/components-core/time-picker/create-time-picker-controller'
import type { TimePickerControllerOptions } from '@fex/components-core/time-picker/types'
import { useEffect } from 'react'
import { useCoreStore } from '../../hooks/use-core-store'
import { useLazyRef } from '../../hooks/use-lazy-ref'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'

export function useTimePicker(options: TimePickerControllerOptions = {}) {
  const onChange = useMemoizedFn((...args: Parameters<NonNullable<TimePickerControllerOptions['onChange']>>) => options.onChange?.(...args))
  const controllerRef = useLazyRef(() => createTimePickerController({
    ...options,
    onChange,
  }))
  const controller = controllerRef.current
  const snapshot = useCoreStore(controller)

  // The controller is an external store; controlled props must be synchronized
  // after React commits rather than copied into a second component state.
  useEffect(() => {
    if (options.value !== undefined) controller.setControlledValue(options.value)
  }, [controller, options.value])

  return { controller, snapshot }
}
