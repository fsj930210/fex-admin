import { createContext, use } from 'react'
import type { SwitchStyleProps } from '@fex/components-styles/switch'
import type { SwitchState } from './switch'
export interface SwitchContextValue { checked: boolean, state: SwitchState, size: SwitchStyleProps['size'] }
export const SwitchContext = createContext<SwitchContextValue | null>(null)
export function useSwitchContext(componentName: string) { const context = use(SwitchContext); if (!context) throw new Error(`${componentName} must be used inside SwitchRoot.`); return context }
