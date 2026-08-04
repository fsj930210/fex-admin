import { createOverlay } from '../overlay/create-overlay'
import type { DrawerController, DrawerOptions, DrawerSnapshot } from './types'

export type { DrawerController, DrawerOptions, DrawerPlacement, DrawerSize, DrawerSnapshot } from './types'

function toOverlayOptions(options: DrawerOptions) {
  return {
    ...options,
    modal: options.modal ?? true,
    closeDelay: options.closeDelay ?? 300,
    dismiss: {
      escapeKey: options.dismiss?.escapeKey ?? true,
      outsidePointer: options.dismiss?.outsidePointer ?? false,
      overlayPointer: options.closeOnMaskPointer ?? options.dismiss?.overlayPointer ?? true,
    },
  }
}

export function createDrawerController(options: DrawerOptions = {}): DrawerController {
  const overlay = createOverlay(toOverlayOptions(options))
  let snapshot: DrawerSnapshot = { ...overlay.getSnapshot(), placement: options.placement ?? 'right' }
  const listeners = new Set<() => void>()
  const unsubscribe = overlay.subscribe(() => {
    snapshot = { ...overlay.getSnapshot(), placement: snapshot.placement }
    listeners.forEach((listener) => listener())
  })
  return {
    ...overlay,
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    setOptions(nextOptions) {
      snapshot = { ...snapshot, placement: nextOptions.placement ?? snapshot.placement }
      overlay.setOptions(toOverlayOptions(nextOptions))
      listeners.forEach((listener) => listener())
    },
    destroy() {
      unsubscribe()
      listeners.clear()
      overlay.destroy()
    },
  }
}
