import type {
  FloatingOverlay,
  FloatingOverlayOptions,
} from '@fex/components-core/overlay/create-floating-overlay'
import { inject, type InjectionKey, type ShallowRef } from 'vue'

export type PopoverSnapshot = ReturnType<FloatingOverlay['getSnapshot']>

export interface PopoverContextValue {
  arrow: ShallowRef<boolean>
  arrowElement: ShallowRef<HTMLElement | null>
  overlay: FloatingOverlay
  triggerElement: ShallowRef<HTMLElement | null>
  snapshot: ShallowRef<PopoverSnapshot>
}

export const popoverKey: InjectionKey<PopoverContextValue> = Symbol('Popover')

export function usePopoverContext(component: string) {
  const context = inject(popoverKey)
  if (!context) {
    throw new Error(`${component} must be used inside Popover`)
  }
  return context
}

export type PopoverRootProps = FloatingOverlayOptions

export interface PopoverDismissRecord {
  overlay: FloatingOverlay
  triggerElement: ShallowRef<HTMLElement | null>
  getContentElement: () => HTMLElement | null
  getArrowElement: () => HTMLElement | null
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
      const triggerElement = record.triggerElement.value
      const contentElement = record.getContentElement()
      const arrowElement = record.getArrowElement()
      if (
        triggerElement?.contains(target) ||
        contentElement?.contains(target) ||
        arrowElement?.contains(target)
      ) {
        return
      }
    }
    record.overlay.close({ reason: 'outside-pointer', event })
  })
}

export function eventInfo(event: Event & Partial<PointerEvent>) {
  return {
    target: event.target,
    currentTarget: event.currentTarget,
    clientX: event.clientX,
    clientY: event.clientY,
    button: event.button,
    pointerType: event.pointerType,
    event,
    preventDefault: event.preventDefault.bind(event),
    stopPropagation: event.stopPropagation.bind(event),
  }
}
