import type { DrawerController } from '@fex-design/core/drawer/create-drawer-controller'
import { getContext } from 'svelte'
export const drawerContextKey = Symbol('Drawer')
export interface DrawerContextValue { drawer: DrawerController; depth: number; snapshot: { subscribe: (run: (value: ReturnType<DrawerController['getSnapshot']>) => void) => () => void }; placement: () => string; mask: () => boolean; size: () => string | number | undefined; resizable: () => boolean; minSize: () => number | undefined; maxSize: () => number | undefined; onSizeChange: () => ((size: number) => void) | undefined; triggerElement: { current: HTMLButtonElement | null } }
export function useDrawer(name: string) { const value = getContext<DrawerContextValue>(drawerContextKey); if (!value) throw new Error(`${name} must be used inside Drawer`); return value }
