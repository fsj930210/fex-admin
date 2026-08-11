import type { InputOTPController, InputOTPSnapshot } from '@fex-design/core/input-otp/types'
import { getContext, setContext } from 'svelte'

export interface InputOTPContextValue {
  controller: InputOTPController
  snapshot: () => InputOTPSnapshot
  registerInput: (index: number, element: HTMLInputElement | null) => void
  focusInput: (index: number, cursor?: 'start' | 'end' | 'all') => void
}

export const inputOTPContextKey = Symbol('InputOTPContext')

export function setInputOTPContext(context: InputOTPContextValue) {
  setContext(inputOTPContextKey, context)
}

export function getInputOTPContext(component: string) {
  const context = getContext<InputOTPContextValue | undefined>(inputOTPContextKey)
  if (!context) throw new Error(`${component} must be used inside InputOTPRoot.`)
  return context
}
