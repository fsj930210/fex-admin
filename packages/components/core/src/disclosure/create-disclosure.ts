import { createStore } from '../store/create-store'

export type DisclosureReason =
  | 'manual'
  | 'trigger-click'
  | 'trigger-hover'
  | 'trigger-focus'
  | 'trigger-context-menu'
  | 'escape-key'
  | 'outside-pointer'
  | 'overlay-pointer'
  | 'reference-hidden'

export interface DisclosureChangeInfo {
  reason: DisclosureReason
  source?: string | undefined
  event?: unknown
}

export interface DisclosureOptions {
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  onOpenChange?: ((open: boolean, info: DisclosureChangeInfo) => void) | undefined
}

export interface DisclosureSnapshot {
  open: boolean
}

export interface Disclosure {
  getSnapshot: () => DisclosureSnapshot
  subscribe: (listener: () => void) => () => void
  setOptions: (options: DisclosureOptions) => void
  setOpen: (open: boolean, info?: Partial<DisclosureChangeInfo>) => void
  open: (info?: Partial<DisclosureChangeInfo>) => void
  close: (info?: Partial<DisclosureChangeInfo>) => void
  toggle: (info?: Partial<DisclosureChangeInfo>) => void
}

function getOpen(options: DisclosureOptions, internalOpen: boolean) {
  // 受控 open 优先级高于内部状态；这是所有框架组件共同遵守的受控/非受控协议。
  // 如果 adapter 自己判断受控逻辑，不同框架很容易出现 onOpenChange 触发顺序不一致。
  return options.open ?? internalOpen
}

function normalizeInfo(info?: Partial<DisclosureChangeInfo>): DisclosureChangeInfo {
  // reason 默认 manual，保证每次状态变化都有可追踪来源。
  // 后续排查“为什么关闭”时，可以从 escape-key/outside-pointer/trigger-hover 等原因反推调用链。
  return { reason: info?.reason ?? 'manual', source: info?.source, event: info?.event }
}

/**
 * 创建最基础的 open/close 状态控制器。
 *
 * disclosure 不知道 DOM、不知道浮层、不知道 trigger，它只解决一个问题：
 * 在受控和非受控两种模式下，统一产生 open 快照和 onOpenChange 通知。
 */
export function createDisclosure(options: DisclosureOptions = {}): Disclosure {
  let currentOptions = options
  let internalOpen = options.defaultOpen ?? false
  const store = createStore<DisclosureSnapshot>({ open: getOpen(currentOptions, internalOpen) })

  function syncSnapshot() {
    const nextOpen = getOpen(currentOptions, internalOpen)
    // open 没变时返回原 snapshot，避免上层 overlay/floating-overlay 因为 setOptions 重复触发渲染。
    store.updateSnapshot((snapshot) => (snapshot.open === nextOpen ? snapshot : { open: nextOpen }))
  }

  function setOpen(nextOpen: boolean, info?: Partial<DisclosureChangeInfo>) {
    const currentOpen = getOpen(currentOptions, internalOpen)
    // 状态相同直接退出，不触发 onOpenChange。
    // 这样 click 已经打开的 trigger、重复 ESC、重复 outside pointer 都不会产生噪音事件。
    if (currentOpen === nextOpen) {
      return
    }

    const changeInfo = normalizeInfo(info)
    // 无论受控还是非受控，都先通知调用方。
    // 受控模式下父组件会决定是否真正更新 open；非受控模式下 core 随后更新 internalOpen。
    currentOptions.onOpenChange?.(nextOpen, changeInfo)

    if (currentOptions.open === undefined) {
      // 非受控模式才写内部状态。受控模式如果也写 internalOpen，会形成重复状态，
      // 最终可能出现 props.open=false 但内部 snapshot.open=true 的不同步问题。
      internalOpen = nextOpen
      syncSnapshot()
      return
    }

    // 受控模式只同步当前 props.open 派生出的 snapshot，不擅自假设父组件会接受这次变更。
    syncSnapshot()
  }

  return {
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,
    setOptions: (nextOptions) => {
      currentOptions = nextOptions
      syncSnapshot()
    },
    setOpen,
    open: (info) => setOpen(true, info),
    close: (info) => setOpen(false, info),
    toggle: (info) => setOpen(!getOpen(currentOptions, internalOpen), info),
  }
}
