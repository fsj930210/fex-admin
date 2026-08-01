import { createContext } from 'react'
import type { createDrawerController } from '@fex/components-core/drawer/create-drawer-controller'
export interface DrawerResizeOptions { size?: string | number; resizable?: boolean; minSize?: number; maxSize?: number; onSizeChange?: (size: number) => void }
export const DrawerContext = createContext<{ drawer: ReturnType<typeof createDrawerController>; contentId: string; triggerRef: React.RefObject<HTMLButtonElement | null>; mask: boolean; depth: number; resizeOptions: DrawerResizeOptions } | null>(null)
export const DrawerResizeContext = createContext<ReturnType<any> | null>(null)
