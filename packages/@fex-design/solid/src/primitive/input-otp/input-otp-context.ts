import type { InputOTPController, InputOTPSnapshot } from '@fex-design/core/input-otp/types'
import { createContext, useContext, type Accessor } from 'solid-js'

export interface InputOTPContextValue {
  controller: InputOTPController
  snapshot: Accessor<InputOTPSnapshot>
  registerInput: (index: number, element: HTMLInputElement | null) => void
  focusInput: (index: number, cursor?: 'start' | 'end' | 'all') => void
}

export const InputOTPContext = createContext<InputOTPContextValue>()

export function useInputOTPContext(component: string) {
  const context = useContext(InputOTPContext)
  if (!context) throw new Error(`${component} must be used inside InputOTPRoot.`)
  return context
}
