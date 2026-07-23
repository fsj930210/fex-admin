import { createContext, useContext } from 'solid-js'
import type { createTabs } from './create-tabs'
export type TabsContextValue = ReturnType<typeof createTabs> & { variant: () => 'default' | 'line' }
export const TabsContext = createContext<TabsContextValue>()
export function useTabsContext(name: string) { const context = useContext(TabsContext); if (!context) throw new Error(`${name} must be used inside TabsRoot.`); return context }
