import type { DrawerController, DrawerOptions, DrawerSnapshot } from '@fex-design/core/drawer/create-drawer-controller'
import { inject, type InjectionKey, type ShallowRef } from 'vue'
export interface DrawerContextValue { drawer: DrawerController; snapshot: ShallowRef<DrawerSnapshot>; placement: ShallowRef<DrawerOptions['placement']>; mask: ShallowRef<boolean>; closeOnMaskPointer: ShallowRef<boolean>; depth: number; triggerElement: ShallowRef<HTMLButtonElement | null>; resizeOptions: { resizable?: boolean; minSize?: number; maxSize?: number; onSizeChange?: (size: number) => void }; resize?: any }
export const drawerKey: InjectionKey<DrawerContextValue> = Symbol('Drawer')
export function useDrawerContext(name: string) { const context = inject(drawerKey); if (!context) throw new Error(`${name} must be used inside DrawerRoot`); return context }
