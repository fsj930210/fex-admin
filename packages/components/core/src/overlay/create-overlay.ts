import { createDisclosure } from '../disclosure/create-disclosure'
import { createStore } from '../store/create-store'
import {
  addLayerRecord,
  createLayerRecord,
  isTargetInsideLayer,
  isTopLayer,
  removeLayerRecord,
} from './layer/layer-stack'
import { createPresence } from './presence/create-presence'
import type { Overlay, OverlayEventInfo, OverlayOptions, OverlaySnapshot } from './types'

export function createOverlay(options: OverlayOptions = {}): Overlay {
  let currentOptions = options
  let overlayElement: HTMLElement | null = null
  // layer 只记录浮层在全局栈中的顺序，dismiss 时用它判断“只有最顶层响应 ESC/外部点击”。
  // 如果所有层都响应，嵌套 Popover/Dialog 会被一次点击全部关闭。
  const layer = createLayerRecord(Boolean(options.modal))
  // disclosure 只负责 open，presence 只负责 mounted/phase；拆开后动画挂载和受控状态不会互相污染。
  const disclosure = createDisclosure(options)
  const presence = createPresence({
    open: disclosure.getSnapshot().open,
    forceMount: options.forceMount,
    closeDelay: options.closeDelay,
  })
  const store = createStore<OverlaySnapshot>({
    open: disclosure.getSnapshot().open,
    mounted: presence.getSnapshot().mounted,
    phase: presence.getSnapshot().phase,
  })

  function readSnapshot(): OverlaySnapshot {
    const nextSnapshot = {
      open: disclosure.getSnapshot().open,
      mounted: presence.getSnapshot().mounted,
      phase: presence.getSnapshot().phase,
    }
    const snapshot = store.getSnapshot()
    // overlay 对外只暴露 open/mounted/phase 三个语义字段。
    // 字段没变时保留旧引用，adapter 可以用引用稳定性减少无意义刷新。
    if (
      snapshot.open === nextSnapshot.open &&
      snapshot.mounted === nextSnapshot.mounted &&
      snapshot.phase === nextSnapshot.phase
    ) {
      return snapshot
    }
    store.setSnapshot(nextSnapshot)
    return nextSnapshot
  }

  function emit() {
    readSnapshot()
  }

  const unsubscribeDisclosure = disclosure.subscribe(() => {
    // open 改变后先同步 presence，让 mounted/phase 跟着 open 进入 opening/closing。
    // 这样 adapter 可以只订阅 overlay snapshot，不需要分别监听 disclosure 和 presence。
    presence.setOptions({
      open: disclosure.getSnapshot().open,
      forceMount: currentOptions.forceMount,
      closeDelay: currentOptions.closeDelay,
    })
    emit()
  })
  const unsubscribePresence = presence.subscribe(emit)

  function closeFromDismiss(reason: Parameters<typeof disclosure.close>[0]) {
    // 关闭类事件只允许最顶层处理，避免外层 Dialog 和内层 Popover 同时收到同一次 ESC/外部点击。
    if (isTopLayer(layer)) {
      close(reason)
      // dismiss 是明确的关闭动作，可以立即结束关闭阶段，避免外部点击后 closeDelay 期间仍被当作顶层。
      presence.finishClose()
    }
  }

  function open(info?: Parameters<typeof disclosure.open>[0]) {
    disclosure.open(info)
    emit()
  }

  function close(info?: Parameters<typeof disclosure.close>[0]) {
    disclosure.close(info)
    emit()
  }

  function toggle(info?: Parameters<typeof disclosure.toggle>[0]) {
    disclosure.toggle(info)
    emit()
  }

  return {
    getSnapshot: store.getSnapshot,
    subscribe: (listener) => {
      return store.subscribe(listener)
    },
    setOptions: (nextOptions) => {
      currentOptions = nextOptions
      layer.modal = Boolean(nextOptions.modal)
      disclosure.setOptions(nextOptions)
      presence.setOptions({
        open: disclosure.getSnapshot().open,
        forceMount: nextOptions.forceMount,
        closeDelay: nextOptions.closeDelay,
      })
      emit()
    },
    setLayerElement: (element) => {
      // layer element 是用于“点击是否发生在当前浮层内”的 DOM 边界。
      // content 挂载时入栈，卸载时出栈；如果忘记出栈，后续外部点击会被旧层误判。
      layer.element = element
      if (element) {
        addLayerRecord(layer)
      } else {
        removeLayerRecord(layer)
      }
    },
    setOverlayElement: (element) => {
      // overlayElement 通常是遮罩层本身，用于 overlayPointer 只在点击遮罩空白处时关闭。
      // 如果点击遮罩里的内容也关闭，就会破坏弹窗内部按钮、表单等交互。
      overlayElement = element
    },
    open,
    close,
    toggle,
    dismiss: {
      escapeKey: (event) => {
        if (currentOptions.dismiss?.escapeKey === false) {
          return
        }
        closeFromDismiss({ reason: 'escape-key', event: event.event })
      },
      outsidePointer: (event: OverlayEventInfo) => {
        if (currentOptions.dismiss?.outsidePointer === false) {
          return
        }
        // 点击当前 layer 内部不算 outside。嵌套层通过全局 layer stack 判断顶层，
        // 当前层内部判断只负责过滤自己的 content 区域。
        if (isTargetInsideLayer(layer, event.target)) {
          return
        }
        closeFromDismiss({ reason: 'outside-pointer', event: event.event })
      },
      overlayPointer: (event) => {
        if (currentOptions.dismiss?.overlayPointer !== true) {
          return
        }
        // 必须精确命中 overlayElement 本身才关闭，避免事件从内容冒泡到遮罩时误关。
        if (event.target !== overlayElement) {
          return
        }
        closeFromDismiss({ reason: 'overlay-pointer', event: event.event })
      },
    },
    destroy: () => {
      unsubscribeDisclosure()
      unsubscribePresence()
      presence.destroy()
      removeLayerRecord(layer)
    },
  }
}
