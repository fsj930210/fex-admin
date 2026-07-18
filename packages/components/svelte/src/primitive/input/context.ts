import { getContext, setContext } from 'svelte'

export type InputChangeReason = 'input' | 'clear'
export interface InputContextValue {
  value: () => string
  disabled: () => boolean
  readOnly: () => boolean
  invalid: () => boolean
  canClear: () => boolean
  setValue: (value: string, reason: InputChangeReason, event?: Event) => void
  clear: () => void
  setFocusElement: (element: HTMLElement | null) => void
}
const key = Symbol('FexInput')
export function setInputContext(value: InputContextValue) { setContext(key, value) }
export function getInputContext(component: string) { const value = getContext<InputContextValue>(key); if (!value) throw new Error(`${component} must be used inside InputRoot.`); return value }
