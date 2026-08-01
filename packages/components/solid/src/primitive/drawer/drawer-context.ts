import { createContext, useContext, type Accessor } from 'solid-js'
import type { createDrawerController, DrawerPlacement } from '@fex/components-core/drawer/create-drawer-controller'
import type { createResize } from '../../primitives/create-resize'

export interface DrawerContextValue {
  drawer: ReturnType<typeof createDrawerController>
  snapshot: Accessor<ReturnType<ReturnType<typeof createDrawerController>['getSnapshot']>>
  placement: () => DrawerPlacement
  mask: () => boolean
  depth: number
  triggerElement: { current: HTMLButtonElement | null }
  resizeOptions: {
    size: () => string | number | undefined
    resizable: () => boolean
    minSize: () => number | undefined
    maxSize: () => number | undefined
    onSizeChange: () => ((size: number) => void) | undefined
  }
  resize?: ReturnType<typeof createResize>
}

export const DrawerContext = createContext<DrawerContextValue>()

export function useDrawer(component: string) {
  const context = useContext(DrawerContext)
  if (!context) throw new Error(`${component} must be used inside Drawer`)
  return context
}
