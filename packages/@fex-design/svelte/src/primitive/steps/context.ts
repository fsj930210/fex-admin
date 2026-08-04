import type { createSteps } from './create-steps.svelte'
export const stepsContextKey = Symbol('StepsContext')
export const stepContextKey = Symbol('StepContext')
export type StepsContextValue = ReturnType<typeof createSteps>
