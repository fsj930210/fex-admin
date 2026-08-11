import type { InputOTPController, InputOTPSnapshot } from '@fex-design/core/input-otp/types'
import { inject, type InjectionKey } from 'vue'

export interface InputOTPContextValue {
  controller: InputOTPController
  snapshot: () => InputOTPSnapshot
  registerInput: (index: number, element: HTMLInputElement | null) => void
  focusInput: (index: number, cursor?: 'start' | 'end' | 'all') => void
}

export const inputOTPContextKey: InjectionKey<InputOTPContextValue> = Symbol('input-otp-context')

export function useInputOTPContext(component: string) {
  const context = inject(inputOTPContextKey)
  if (!context) throw new Error(`${component} must be used inside InputOTPRoot.`)
  return context
}
