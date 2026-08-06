import type { TextareaAutoSize } from '@fex-design/core/textarea/autosize'
import { getContext, setContext } from 'svelte'

export type TextareaChangeReason = 'input' | 'clear'

export interface TextareaContextValue {
  value: () => string
  disabled: () => boolean
  readOnly: () => boolean
  invalid: () => boolean
  canClear: () => boolean
  autoSize: () => TextareaAutoSize | undefined
  setValue: (value: string, reason: TextareaChangeReason, event?: Event) => void
  clear: () => void
  setFocusElement: (element: HTMLTextAreaElement | null) => void
  syncAutoSize: () => void
}

const key = Symbol('FexTextarea')

export function setTextareaContext(value: TextareaContextValue) {
  setContext(key, value)
}

export function getTextareaContext(component: string) {
  const value = getContext<TextareaContextValue>(key)
  if (!value) throw new Error(`${component} must be used inside TextareaRoot.`)
  return value
}
