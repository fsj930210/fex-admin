import type { DisclosureChangeInfo } from '../disclosure/create-disclosure'
import { createStore } from '../store/create-store'
import { createFloating, type FloatingOptions, type FloatingSnapshot } from '../floating/create-floating'
import { createOverlay } from './create-overlay'
import { createTrigger, type OverlayTrigger } from './trigger/create-trigger'
import type { Overlay, OverlayEventInfo, OverlayOptions, OverlaySnapshot } from './types'

export interface FloatingOverlayOptions extends OverlayOptions, FloatingOptions {
  trigger?: OverlayTrigger[] | undefined
  allowedTriggers?: OverlayTrigger[] | undefined
  hoverOpenDelay?: number | undefined
  hoverCloseDelay?: number | undefined
  disabled?: boolean | undefined
  getPopupContainer?: ((referenceElement: HTMLElement | null) => HTMLElement) | undefined
}

export interface FloatingOverlaySnapshot extends OverlaySnapshot, FloatingSnapshot {
  trigger: OverlayTrigger[]
}

export interface FloatingOverlay
  extends Omit<Overlay, 'getSnapshot' | 'subscribe' | 'setOptions' | 'destroy'> {
  getSnapshot: () => FloatingOverlaySnapshot
  subscribe: (listener: () => void) => () => void
  setOptions: (options: FloatingOverlayOptions) => void
  setReferenceElement: (element: HTMLElement | null) => void
  setFloatingElement: (element: HTMLElement | null) => void
  setArrowElement: (element: HTMLElement | null) => void
  setVirtualReference: ReturnType<typeof createFloating>['setVirtualReference']
  updatePosition: () => Promise<void>
  resolvePopupContainer: () => HTMLElement | null
  trigger: ReturnType<typeof createTrigger>['trigger']
  content: ReturnType<typeof createTrigger>['content']
  destroy: () => void
}

function toEventInfo(event: Event & Partial<PointerEvent>) {
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


export function createFloatingOverlay(options: FloatingOverlayOptions = {}): FloatingOverlay {
  let currentOptions = options
  let referenceElement: HTMLElement | null = null
  let floatingElement: HTMLElement | null = null
  let arrowElement: HTMLElement | null = null
  let dismissDocument: Document | null = null
  // Combines overlay state, floating DOM positioning, and trigger event requests.
  // Keep the instance stable; framework adapters update options instead of recreating it.
  const overlay = createOverlay(options)
  const floating = createFloating(options)

  const trigger = createTrigger({
    trigger: options.trigger,
    allowedTriggers: options.allowedTriggers,
    hoverOpenDelay: options.hoverOpenDelay,
    hoverCloseDelay: options.hoverCloseDelay,
    disabled: options.disabled,
    onOpenChangeRequest: (open, info) => {
      overlay[open ? 'open' : 'close'](info)
    },
  })

  function createSnapshot(): FloatingOverlaySnapshot {
    return {
      ...overlay.getSnapshot(),
      ...floating.getSnapshot(),
      trigger: trigger.getTriggers(),
    }
  }

  const store = createStore<FloatingOverlaySnapshot>(createSnapshot())

  function readSnapshot(): FloatingOverlaySnapshot {
    const overlaySnapshot = overlay.getSnapshot()
    const floatingSnapshot = floating.getSnapshot()
    const nextSnapshot = {
      ...overlaySnapshot,
      ...floatingSnapshot,
      trigger: trigger.getTriggers(),
    }
    const snapshot = store.getSnapshot()
    // Only publish semantic snapshot changes to avoid noisy adapter refreshes.
    if (
      snapshot.open === nextSnapshot.open &&
      snapshot.mounted === nextSnapshot.mounted &&
      snapshot.phase === nextSnapshot.phase &&
      snapshot.placement === nextSnapshot.placement &&
      snapshot.side === nextSnapshot.side &&
      snapshot.align === nextSnapshot.align &&
      snapshot.referenceHidden === nextSnapshot.referenceHidden &&
      snapshot.escaped === nextSnapshot.escaped &&
      snapshot.trigger === nextSnapshot.trigger
    ) {
      return snapshot
    }
    store.setSnapshot(nextSnapshot)
    return nextSnapshot
  }


  function isInsideDismissBoundary(target: EventTarget | null) {
    return (
      target instanceof Node &&
      (referenceElement?.contains(target) ||
        floatingElement?.contains(target) ||
        arrowElement?.contains(target))
    )
  }

  function handleDocumentPointerDown(event: PointerEvent) {
    if (isInsideDismissBoundary(event.target)) {
      return
    }
    trigger.clear({ reason: 'outside-pointer', event }, false)
    overlay.dismiss.outsidePointer(toEventInfo(event))
  }

  function handleDocumentKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Escape') {
      return
    }
    trigger.clear({ reason: 'escape-key', event }, false)
    overlay.dismiss.escapeKey(toEventInfo(event))
  }

  function stopDocumentDismiss() {
    if (!dismissDocument) {
      return
    }
    dismissDocument.removeEventListener('pointerdown', handleDocumentPointerDown, true)
    dismissDocument.removeEventListener('keydown', handleDocumentKeyDown, true)
    dismissDocument = null
  }

  function syncDocumentDismiss(nextSnapshot = store.getSnapshot()) {
    const dismiss = currentOptions.dismiss
    const dismissDisabled = dismiss?.escapeKey === false && dismiss.outsidePointer === false
    if (dismissDisabled || !nextSnapshot.open || !nextSnapshot.mounted || !floatingElement) {
      stopDocumentDismiss()
      return
    }

    const ownerDocument = floatingElement.ownerDocument
    if (dismissDocument === ownerDocument) {
      return
    }

    stopDocumentDismiss()
    dismissDocument = ownerDocument
    ownerDocument.addEventListener('pointerdown', handleDocumentPointerDown, true)
    ownerDocument.addEventListener('keydown', handleDocumentKeyDown, true)
  }

  function syncAutoUpdate(nextSnapshot = store.getSnapshot()) {
    // Floating UI 的 autoUpdate 需要真实 DOM 已经挂载，所以必须同时满足 open 和 mounted。
    if (nextSnapshot.open && nextSnapshot.mounted) {
      void floating.update()
      floating.startAutoUpdate()
      return
    }
    floating.stopAutoUpdate()
  }

  function emitFromOverlay() {
    const nextSnapshot = readSnapshot()
    syncAutoUpdate(nextSnapshot)
    syncDocumentDismiss(nextSnapshot)
  }

  function emitFromFloating() {
    readSnapshot()
  }

  const unsubscribeOverlay = overlay.subscribe(emitFromOverlay)
  const unsubscribeFloating = floating.subscribe(emitFromFloating)

  function makeTriggerOptions(nextOptions: FloatingOverlayOptions) {
    return {
      trigger: nextOptions.trigger,
      allowedTriggers: nextOptions.allowedTriggers,
      hoverOpenDelay: nextOptions.hoverOpenDelay,
      hoverCloseDelay: nextOptions.hoverCloseDelay,
      disabled: nextOptions.disabled,
      onOpenChangeRequest: (open: boolean, info: DisclosureChangeInfo) => {
        overlay[open ? 'open' : 'close'](info)
      },
    }
  }

  return {
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,
    setOptions: (nextOptions) => {
      currentOptions = nextOptions
      overlay.setOptions(nextOptions)
      floating.setOptions(nextOptions)
      trigger.setOptions(makeTriggerOptions(nextOptions))
      emitFromOverlay()
    },
    setLayerElement: overlay.setLayerElement,
    setOverlayElement: overlay.setOverlayElement,
    setReferenceElement: (element) => {
      referenceElement = element
      floating.setReferenceElement(element)
      syncDocumentDismiss()
    },
    setFloatingElement: (element) => {
      floatingElement = element
      // floatingElement 同时是 overlay layer 边界和 floating 定位元素。
      overlay.setLayerElement(element)
      floating.setFloatingElement(element)
      syncDocumentDismiss()
    },
    setArrowElement: (element) => {
      arrowElement = element
      floating.setArrowElement(element)
      syncDocumentDismiss()
    },
    setVirtualReference: floating.setVirtualReference,
    updatePosition: floating.update,
    resolvePopupContainer: () => {
      if (currentOptions.getPopupContainer) {
        return currentOptions.getPopupContainer(referenceElement)
      }
      return referenceElement?.ownerDocument.body ?? globalThis.document?.body ?? null
    },
    open: overlay.open,
    close: (info) => {
      trigger.clear(info, false)
      overlay.close(info)
    },
    toggle: overlay.toggle,
    dismiss: {
      escapeKey: (event: OverlayEventInfo) => {
        trigger.clear({ reason: 'escape-key', event: event.event }, false)
        overlay.dismiss.escapeKey(event)
      },
      outsidePointer: (event) => {
        trigger.clear({ reason: 'outside-pointer', event: event.event }, false)
        overlay.dismiss.outsidePointer(event)
      },
      overlayPointer: overlay.dismiss.overlayPointer,
    },
    trigger: trigger.trigger,
    content: trigger.content,
    destroy: () => {
      stopDocumentDismiss()
      unsubscribeOverlay()
      unsubscribeFloating()
      trigger.destroy()
      floating.destroy()
      overlay.destroy()
    },
  }
}
