import type { Overlay, OverlayOptions, OverlaySnapshot } from '../overlay/types'

export interface DialogOptions
  extends Omit<OverlayOptions, 'trigger' | 'allowedTriggers' | 'hoverOpenDelay' | 'hoverCloseDelay'> {
  closeOnOverlayPointer?: boolean | undefined
}

export type DialogSnapshot = OverlaySnapshot

export interface DialogController extends Overlay {
  setOptions: (options: DialogOptions) => void
}
