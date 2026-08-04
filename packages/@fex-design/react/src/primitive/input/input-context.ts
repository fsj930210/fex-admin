import { createContext, use } from 'react'
import type { InputController } from './use-input'

export const InputContext = createContext<InputController | null>(null)

export function useInputContext(componentName: string) {
  const context = use(InputContext)
  if (!context) {
    throw new Error(`${componentName} must be used inside InputRoot.`)
  }
  return context
}
