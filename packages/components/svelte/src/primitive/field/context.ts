import { getContext, setContext } from 'svelte'

export interface FieldContextValue {
  controlId: () => string
  descriptionId: () => string
  errorId: () => string
  disabled: () => boolean
  invalid: () => boolean
  readOnly: () => boolean
  required: () => boolean
  hasDescription: () => boolean
  hasError: () => boolean
}

const key = Symbol('FexField')
export function setFieldContext(value: FieldContextValue) { setContext(key, value) }
export function getFieldContext(component: string) { const value = getContext<FieldContextValue>(key); if (!value) throw new Error(`${component} must be used inside FieldRoot.`); return value }
