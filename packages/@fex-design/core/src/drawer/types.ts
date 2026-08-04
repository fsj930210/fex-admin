import type { Overlay, OverlayOptions, OverlaySnapshot } from '../overlay/types'

export type DrawerPlacement = 'top' | 'right' | 'bottom' | 'left'
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full' | number | string

export interface DrawerOptions extends Omit<OverlayOptions, 'trigger' | 'allowedTriggers' | 'hoverOpenDelay' | 'hoverCloseDelay'> {
  placement?: DrawerPlacement
  mask?: boolean
  closeOnMaskPointer?: boolean
}

export interface DrawerSnapshot extends OverlaySnapshot {
  placement: DrawerPlacement
}

export interface DrawerController extends Overlay {
  getSnapshot: () => DrawerSnapshot
  setOptions: (options: DrawerOptions) => void
}
