import type { FloatingOverlay, FloatingOverlayOptions } from '../create-floating-overlay'
import type { OverlayEventInfo } from '../types'

export interface ContextMenuTarget<T> {
  payload: T | undefined
  element: HTMLElement | null
  clientX: number
  clientY: number
  event: unknown
}

export interface ContextMenuOpenChangeInfo<T> {
  reason: string
  payload: T | undefined
  target: HTMLElement | null
  clientX?: number
  clientY?: number
  event?: unknown
}

export interface ContextMenuOptions<T>
  extends Omit<FloatingOverlayOptions, 'trigger' | 'allowedTriggers' | 'onOpenChange'> {
  onOpenChange?: (open: boolean, info: ContextMenuOpenChangeInfo<T>) => void
}

export interface ContextMenuSnapshot<T> {
  overlay: ReturnType<FloatingOverlay['getSnapshot']>
  target: ContextMenuTarget<T> | null
}

export interface ContextMenuController<T> {
  overlay: FloatingOverlay
  getSnapshot: () => ContextMenuSnapshot<T>
  subscribe: (listener: () => void) => () => void
  setOptions: (options: ContextMenuOptions<T>) => void
  openAt: (target: ContextMenuTarget<T>, event: OverlayEventInfo) => void
  close: (event?: Partial<{ event: unknown }>) => void
  destroy: () => void
}
