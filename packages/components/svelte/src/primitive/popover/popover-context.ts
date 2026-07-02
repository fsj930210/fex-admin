import type { FloatingOverlay } from '@fex/components-core/overlay/create-floating-overlay'
import type { Readable } from 'svelte/store'

export const popoverContextKey = Symbol('Popover')

export interface PopoverContext {
  arrow: () => boolean
  arrowElement: { current: HTMLElement | null }
  overlay: FloatingOverlay
  snapshot: Readable<ReturnType<FloatingOverlay['getSnapshot']>>
  contentElement: { current: HTMLElement | null }
  triggerElement: { current: HTMLElement | null }
}

export interface PopoverDismissRecord {
  arrowElement: { current: HTMLElement | null }
  contentElement: { current: HTMLElement | null }
  overlay: FloatingOverlay
  triggerElement: { current: HTMLElement | null }
}

const dismissRecords = new Set<PopoverDismissRecord>()

export function registerPopoverDismissRecord(record: PopoverDismissRecord) {
  dismissRecords.add(record)
  return () => dismissRecords.delete(record)
}

export function dismissOpenPopovers(event: Event, except?: FloatingOverlay) {
  const target = event.target
  dismissRecords.forEach((record) => {
    if (record.overlay === except || !record.overlay.getSnapshot().open) {
      return
    }
    if (target instanceof Node) {
      if (
        record.triggerElement.current?.contains(target) ||
        record.contentElement.current?.contains(target) ||
        record.arrowElement.current?.contains(target)
      ) {
        return
      }
    }
    record.overlay.close({ reason: 'outside-pointer', event })
  })
}
