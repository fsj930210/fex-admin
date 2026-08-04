import type { createTabs } from './create-tabs.svelte'
export type TabsContextValue = ReturnType<typeof createTabs> & { variant: () => 'default' | 'line' }
export const tabsContextKey = Symbol('TabsContext')
