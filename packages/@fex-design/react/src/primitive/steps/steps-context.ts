import { createContext, use } from 'react'
import type { useSteps } from './use-steps'

export const StepsContext = createContext<ReturnType<typeof useSteps> | null>(null)
export const StepContext = createContext<{ status: import('@fex-design/core/steps/types').StepStatus; position: number } | null>(null)

export function useStepsContext(name: string) {
  const context = use(StepsContext)
  if (!context) throw new Error(`${name} must be used inside Steps.`)
  return context
}

export function useStepContext(name: string) {
  const context = use(StepContext)
  if (!context) throw new Error(`${name} must be used inside Step.`)
  return context
}
