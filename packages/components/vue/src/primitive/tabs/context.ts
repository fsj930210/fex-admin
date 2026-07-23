import type { InjectionKey } from 'vue'
import type { useTabs } from './use-tabs'

export type TabsContextValue = ReturnType<typeof useTabs> & { variant: () => 'default' | 'line' }
export const tabsContextKey: InjectionKey<TabsContextValue> = Symbol('TabsContext')
