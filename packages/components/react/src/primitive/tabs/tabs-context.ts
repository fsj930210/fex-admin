import { createContext, use } from 'react'
import type { TabsStyleProps } from '@fex/components-styles/tabs'
import type { useTabs } from './use-tabs'

export type TabsContextValue = ReturnType<typeof useTabs> & { variant: NonNullable<TabsStyleProps['variant']> }
export const TabsContext = createContext<TabsContextValue | null>(null)

export function useTabsContext(componentName: string) {
  const context = use(TabsContext)
  if (!context) throw new Error(`${componentName} must be used inside TabsRoot.`)
  return context
}
