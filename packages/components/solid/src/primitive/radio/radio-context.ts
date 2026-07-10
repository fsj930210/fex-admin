import { createContext, useContext } from 'solid-js'
import type { RadioValue } from './radio'
export interface RadioContextValue { value: () => RadioValue | undefined, disabled: () => boolean, select: (value: RadioValue) => void }
export const RadioContext = createContext<RadioContextValue>()
export function useRadioContext(componentName: string) { const context = useContext(RadioContext); if (!context) throw new Error(`${componentName} must be used inside RadioGroup.`); return context }
