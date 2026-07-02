import { createStore } from '../../store/create-store'
import type { OverlayPhase } from '../types'

export interface PresenceOptions {
  open?: boolean | undefined
  forceMount?: boolean | undefined
  closeDelay?: number | undefined
}

export interface PresenceSnapshot {
  mounted: boolean
  phase: OverlayPhase
}

export interface Presence {
  getSnapshot: () => PresenceSnapshot
  subscribe: (listener: () => void) => () => void
  setOptions: (options: PresenceOptions) => void
  finishClose: () => void
  destroy: () => void
}

function getSnapshotFromOptions(options: PresenceOptions): PresenceSnapshot {
  const open = options.open ?? false
  return {
    // forceMount 用于动画库或用户自定义渲染：即使关闭也保留 DOM。
    // mounted 只回答“DOM 是否应该存在”，phase 才回答“现在处于哪个过渡阶段”。
    mounted: Boolean(options.forceMount || open),
    phase: open ? 'open' : 'closed',
  }
}

function setPresenceSnapshot(store: ReturnType<typeof createStore<PresenceSnapshot>>, next: PresenceSnapshot) {
  // presence 更新频率会比较高，尤其 closeDelay/opening 定时器会连续触发。
  // 字段相同就返回原引用，避免 overlay 组合层和 adapter 被重复唤醒。
  store.updateSnapshot((snapshot) =>
    snapshot.mounted === next.mounted && snapshot.phase === next.phase ? snapshot : next,
  )
}

export function createPresence(options: PresenceOptions = {}): Presence {
  let currentOptions = options
  let closeTimer: ReturnType<typeof setTimeout> | undefined
  let openTimer: ReturnType<typeof setTimeout> | undefined
  // presenceVersion 用于丢弃过期的异步阶段切换。
  // 例如刚进入 opening，用户马上关闭；如果没有版本校验，opening 的 setTimeout 可能把 phase 改回 open。
  let presenceVersion = 0
  const store = createStore<PresenceSnapshot>(getSnapshotFromOptions(currentOptions))

  function clearCloseTimer() {
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = undefined
    }
  }

  function clearOpenTimer() {
    if (openTimer) {
      clearTimeout(openTimer)
      openTimer = undefined
    }
  }

  function finishClose() {
    // finishClose 是关闭流程的最终落点：清理所有阶段定时器，然后根据 forceMount 决定是否保留 DOM。
    // dismiss 会直接调用它，避免已经关闭的层在 closeDelay 期间继续占据顶层。
    clearCloseTimer()
    clearOpenTimer()
    setPresenceSnapshot(store, {
      mounted: Boolean(currentOptions.forceMount),
      phase: 'closed',
    })
  }

  function sync() {
    presenceVersion += 1
    const version = presenceVersion
    const snapshot = store.getSnapshot()
    const open = currentOptions.open ?? false

    if (open) {
      // 打开时必须取消关闭定时器，否则“关闭延迟尚未结束又重新打开”的场景会被旧 timer 关闭。
      clearCloseTimer()
      const nextPhase: OverlayPhase = snapshot.phase === 'closed' ? 'opening' : 'open'
      setPresenceSnapshot(store, { mounted: true, phase: nextPhase })
      clearOpenTimer()
      // 用 0ms timer 把 opening 推进到 open，让 adapter 有一个稳定的 opening 帧可用于入场动画。
      // 不直接同步改成 open，是为了避免 CSS/transition 还没来得及读取 opening 状态。
      openTimer = setTimeout(() => {
        if (presenceVersion === version && (currentOptions.open ?? false)) {
          setPresenceSnapshot(store, { mounted: true, phase: 'open' })
        }
      }, 0)
      return
    }

    clearOpenTimer()
    if (snapshot.mounted && snapshot.phase !== 'closed') {
      if (snapshot.phase === 'closing' && closeTimer) {
        // 已经在 closing 且 timer 存在时不重复创建关闭定时器，否则 closeDelay 会被不断延长。
        return
      }
      const closeDelay = currentOptions.closeDelay ?? 0
      if (closeDelay <= 0) {
        // 没有关闭动画时直接卸载，避免 DOM 残留影响外部点击和层级判断。
        finishClose()
        return
      }
      // 有关闭动画时先保持 mounted=true，让 adapter 能渲染 closing 状态。
      setPresenceSnapshot(store, { mounted: true, phase: 'closing' })
      closeTimer = setTimeout(finishClose, closeDelay)
      return
    }

    setPresenceSnapshot(store, { mounted: Boolean(currentOptions.forceMount), phase: 'closed' })
  }

  return {
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,
    setOptions: (nextOptions) => {
      currentOptions = nextOptions
      sync()
    },
    finishClose,
    destroy: () => {
      clearCloseTimer()
      clearOpenTimer()
    },
  }
}
