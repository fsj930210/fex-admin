import type { SelectionChangeMeta, SelectionValue } from '@fex/components-core/selection/types'
import { inject, type InjectionKey } from 'vue'

export type RadioValue = SelectionValue
export interface RadioChangeMeta {
  previousValue: RadioValue | undefined
  value: RadioValue
  changedValues: SelectionChangeMeta['changedValues']
}
export interface RadioContextValue {
  value: () => RadioValue | undefined
  disabled: () => boolean
  select: (value: RadioValue) => void
}
export const radioContextKey: InjectionKey<RadioContextValue> = Symbol('radio-context')
export function useRadioContext(componentName: string) {
  const context = inject(radioContextKey)
  if (!context) throw new Error(`${componentName} must be used inside RadioGroup.`)
  return context
}
