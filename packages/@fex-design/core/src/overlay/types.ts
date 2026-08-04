import type { DisclosureChangeInfo, DisclosureOptions } from '../disclosure/create-disclosure'

export type OverlayPhase = 'closed' | 'opening' | 'open' | 'closing'

export interface OverlayEventInfo {
  target?: EventTarget | null | undefined
  currentTarget?: EventTarget | null | undefined
  clientX?: number | undefined
  clientY?: number | undefined
  button?: number | undefined
  pointerType?: string | undefined
  event?: unknown
  preventDefault?: (() => void) | undefined
  stopPropagation?: (() => void) | undefined
}

export interface OverlayDismissOptions {
  escapeKey?: boolean | undefined
  outsidePointer?: boolean | undefined
  overlayPointer?: boolean | undefined
}

export interface OverlayOptions extends DisclosureOptions {
  forceMount?: boolean | undefined
  closeDelay?: number | undefined
  modal?: boolean | undefined
  dismiss?: OverlayDismissOptions | undefined
}

export interface OverlaySnapshot {
  open: boolean
  mounted: boolean
  phase: OverlayPhase
}

export interface Overlay {
  getSnapshot: () => OverlaySnapshot
  subscribe: (listener: () => void) => () => void
  setOptions: (options: OverlayOptions) => void
  setLayerElement: (element: HTMLElement | null) => void
  setOverlayElement: (element: HTMLElement | null) => void
  open: (info?: Partial<DisclosureChangeInfo>) => void
  close: (info?: Partial<DisclosureChangeInfo>) => void
  toggle: (info?: Partial<DisclosureChangeInfo>) => void
  dismiss: {
    escapeKey: (event: OverlayEventInfo) => void
    outsidePointer: (event: OverlayEventInfo) => void
    overlayPointer: (event: OverlayEventInfo) => void
  }
  destroy: () => void
}
