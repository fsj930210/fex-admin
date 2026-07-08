import type { SelectionValue } from '@fex/components-core/selection/types'

export type RadioValue = SelectionValue

export interface RadioContextValue {
  value: () => RadioValue | undefined
  disabled: () => boolean
  select: (value: RadioValue) => void
}

export const radioContextKey = Symbol('RadioContext')
