import { createContext, use } from 'react'
import type { RadioValue } from './radio'
export interface RadioContextValue { value: RadioValue | undefined, disabled: boolean, select: (value: RadioValue) => void }
export const RadioContext = createContext<RadioContextValue | null>(null)
export function useRadioContext(componentName: string) { const context = use(RadioContext); if (!context) throw new Error(`${componentName} must be used inside RadioGroup.`); return context }
