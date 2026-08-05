import { createStore } from '../../store/create-store'
import { createFloatingOverlay, type FloatingOverlayOptions } from '../create-floating-overlay'
import type { OverlayEventInfo } from '../types'
import type {
  ContextMenuController,
  ContextMenuOptions,
  ContextMenuSnapshot,
  ContextMenuTarget,
} from './types'

function pointReference(clientX: number, clientY: number) {
  return {
    getBoundingClientRect: () => ({
      x: clientX,
      y: clientY,
      top: clientY,
      left: clientX,
      right: clientX,
      bottom: clientY,
      width: 0,
      height: 0,
      toJSON: () => ({}),
    }),
  }
}

export function createContextMenuController<T>(
  options: ContextMenuOptions<T> = {},
): ContextMenuController<T> {
  let currentOptions = options
  let activeTarget: ContextMenuTarget<T> | null = null
  const store = createStore<ContextMenuSnapshot<T>>({
    overlay: undefined as never,
    target: null,
  })

  function emitSnapshot() {
    store.setSnapshot({ overlay: overlay.getSnapshot(), target: activeTarget })
  }

  function notifyChange(open: boolean, info: Parameters<NonNullable<FloatingOverlayOptions['onOpenChange']>>[1]) {
    const target = activeTarget
    currentOptions.onOpenChange?.(open, {
      reason: info.reason,
      payload: target?.payload,
      target: target?.element ?? null,
      event: info.event,
      ...(target ? { clientX: target.clientX, clientY: target.clientY } : {}),
    })
    if (!open) {
      activeTarget = null
      overlay.setVirtualReference(null)
    }
    emitSnapshot()
  }

  const overlay = createFloatingOverlay({
    ...options,
    trigger: ['context-menu'],
    allowedTriggers: ['context-menu'],
    side: options.side ?? 'right',
    align: options.align ?? 'start',
    sideOffset: options.sideOffset ?? 2,
    arrow: options.arrow ?? false,
    onOpenChange: notifyChange,
  })
  emitSnapshot()

  const unsubscribe = overlay.subscribe(emitSnapshot)
  return {
    overlay,
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,
    setOptions: (nextOptions) => {
      currentOptions = nextOptions
      overlay.setOptions({
        ...nextOptions,
        trigger: ['context-menu'],
        allowedTriggers: ['context-menu'],
        side: nextOptions.side ?? 'right',
        align: nextOptions.align ?? 'start',
        sideOffset: nextOptions.sideOffset ?? 2,
        arrow: nextOptions.arrow ?? false,
        onOpenChange: notifyChange,
      })
      emitSnapshot()
    },
    openAt: (target, event) => {
      activeTarget = target
      overlay.setReferenceElement(target.element)
      overlay.setVirtualReference(pointReference(target.clientX, target.clientY))
      event.preventDefault?.()
      overlay.trigger.contextMenu(event)
      emitSnapshot()
    },
    close: (info) => overlay.close({ reason: 'manual', event: info?.event }),
    destroy: () => {
      unsubscribe()
      overlay.destroy()
    },
  }
}
