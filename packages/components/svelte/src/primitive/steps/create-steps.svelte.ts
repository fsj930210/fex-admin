import { createStepsController } from '@fex/components-core/steps/create-steps-controller'
import type { StepsChangeMeta, StepsOrientation, StepRecord, StepValue } from '@fex/components-core/steps/types'
import { readableCoreStore } from '../../stores/core-store'

export interface CreateStepsOptions { readonly current?: StepValue; readonly defaultCurrent?: StepValue; readonly navigation?: boolean; readonly orientation?: StepsOrientation; readonly onChange?: (value: StepValue, meta: StepsChangeMeta) => void }
export function createSteps(options: CreateStepsOptions = {}) {
  const controller = createStepsController(options); const snapshot = readableCoreStore(controller); const elements = new Map<StepValue, HTMLElement>()
  const syncOptions = () => controller.updateOptions(options)
  function syncOrder() { controller.setOrder([...elements.entries()].sort((left, right) => left[1].compareDocumentPosition(right[1]) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1).map(([value]) => value)) }
  function register(record: StepRecord, element: HTMLElement | null) { if (element) { controller.registerStep(record); elements.set(record.value, element) } else { elements.delete(record.value); controller.unregisterStep(record.value) } syncOrder() }
  function keydown(event: KeyboardEvent, record: StepRecord) { if (!options.navigation || record.disabled) return; if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); controller.select(record.value, 'keyboard'); return } const horizontal = (options.orientation ?? 'horizontal') === 'horizontal'; const direction = event.key === 'Home' ? 'first' : event.key === 'End' ? 'last' : event.key === (horizontal ? 'ArrowRight' : 'ArrowDown') ? 'next' : event.key === (horizontal ? 'ArrowLeft' : 'ArrowUp') ? 'previous' : undefined; if (direction) { event.preventDefault(); const value = controller.move(record.value, direction); if (value !== undefined) { elements.get(value)?.focus(); controller.select(value, 'keyboard') } } }
  return { controller, snapshot, syncOptions, register, keydown, orientation: () => options.orientation ?? 'horizontal', navigation: () => options.navigation === true }
}

export type { StepBuiltinStatus, StepInfo, StepRecord, StepsChangeMeta, StepsChangeTrigger, StepsOrientation, StepStatus, StepValue } from '@fex/components-core/steps/types'
