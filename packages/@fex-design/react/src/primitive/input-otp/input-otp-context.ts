import type {
  InputOTPController,
  InputOTPSnapshot,
} from '@fex-design/core/input-otp/types'
import { createContext, use } from 'react'

export interface InputOTPContextValue {
  controller: InputOTPController
  snapshot: InputOTPSnapshot
  registerInput: (index: number, element: HTMLInputElement | null) => void
  focusInput: (index: number, cursor?: 'start' | 'end' | 'all') => void
}

export const InputOTPContext = createContext<InputOTPContextValue | null>(null)

export function useInputOTPContext(component: string) {
  const context = use(InputOTPContext)
  if (!context) throw new Error(`${component} must be used inside InputOTPRoot.`)
  return context
}
