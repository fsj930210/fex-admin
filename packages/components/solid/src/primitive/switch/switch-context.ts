import { createContext, useContext, type Accessor } from 'solid-js'
import type { SwitchStyleProps } from '@fex/components-styles/switch'
import type { SwitchState } from './switch'
export interface SwitchContextValue { checked: Accessor<boolean>, state: Accessor<SwitchState>, size: Accessor<SwitchStyleProps['size']> }
export const SwitchContext = createContext<SwitchContextValue>()
export function useSwitchContext(componentName: string) { const context = useContext(SwitchContext); if (!context) throw new Error(`${componentName} must be used inside SwitchRoot.`); return context }
