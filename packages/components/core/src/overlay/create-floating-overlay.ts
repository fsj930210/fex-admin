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

export function createFloatingOverlay(options: FloatingOverlayOptions = {}): FloatingOverlay {
  let currentOptions = options
  let referenceElement: HTMLElement | null = null
  // createFloatingOverlay 是面向 Popover/Tooltip 这类组件的组合器：
  // overlay 负责开关、挂载、关闭协议；floating 只负责 DOM 定位；trigger 只负责把用户事件转成开关请求。
  // 这里不把 floating 重新做成 overlay 的子能力，是为了让 Dialog 可以只用 overlay，虚拟菜单可以只用 floating。
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
    // 组合 snapshot 只有在语义字段变化时才写入 store。
    // 这样 adapter 不会因为内部模块重复通知而做无意义刷新，也能避免跨框架响应式层收到过多更新。
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

  function syncAutoUpdate(nextSnapshot = store.getSnapshot()) {
    // Floating UI 的 autoUpdate 需要真实 DOM 已经挂载。
    // 所以必须同时满足 open 和 mounted，再启动滚动、resize、布局变化监听。
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
    },
    setFloatingElement: (element) => {
      // floatingElement 同时也是 overlay layer 元素：overlay 用它判断层级和外部交互，
      // floating 用它写入定位 CSS 变量。两个模块共享同一个 DOM，但职责保持分开。
      overlay.setLayerElement(element)
      floating.setFloatingElement(element)
    },
    setArrowElement: floating.setArrowElement,
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
      unsubscribeOverlay()
      unsubscribeFloating()
      trigger.destroy()
      floating.destroy()
      overlay.destroy()
    },
  }
}
