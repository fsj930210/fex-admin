export type StoreListener = () => void

export interface Store<TSnapshot> {
  getSnapshot: () => TSnapshot
  setSnapshot: (nextSnapshot: TSnapshot) => void
  updateSnapshot: (updater: (snapshot: TSnapshot) => TSnapshot) => void
  subscribe: (listener: StoreListener) => () => void
  subscribeSelector: <TSlice>(
    selector: (snapshot: TSnapshot) => TSlice,
    listener: (slice: TSlice, previousSlice: TSlice) => void,
    isEqual?: (left: TSlice, right: TSlice) => boolean,
  ) => () => void
}

/**
 * 创建一个最小的快照仓库。
 *
 * 设计目标：
 * 1. core 只暴露 getSnapshot + subscribe，方便 React/Vue/Solid/Svelte/Angular 各自桥接成本框架响应式。
 * 2. store 只负责“快照变了”这件事，不承载业务语义，业务动作必须放在 controller/action 中。
 * 3. 通过 Object.is 判断引用是否变化，鼓励上层使用不可变 snapshot，避免原地修改导致某些框架订阅不到变化。
 */
export function createStore<TSnapshot>(initialSnapshot: TSnapshot): Store<TSnapshot> {
  let snapshot = initialSnapshot
  const listeners = new Set<StoreListener>()

  function emit() {
    // Set 会保持订阅顺序，遍历期间删除当前 listener 也是安全的。
    // 这里不把 listener 包装成事件总线，是为了避免 core 模块之间通过 emit/on 传业务语义。
    for (const listener of listeners) {
      listener()
    }
  }

  return {
    getSnapshot: () => snapshot,
    setSnapshot: (nextSnapshot) => {
      // Object.is 可以正确处理 NaN 和 -0 等 JS 边界值；更重要的是它只比较引用。
      // 如果调用方原地修改对象再传回同一个引用，这里不会通知，目的是强制 core 保持快照不可变。
      if (Object.is(snapshot, nextSnapshot)) {
        return
      }
      snapshot = nextSnapshot
      emit()
    },
    updateSnapshot: (updater) => {
      const nextSnapshot = updater(snapshot)
      // updater 可以返回原 snapshot 表示“语义没有变化”，这样上层 controller 可以集中做去重，
      // adapter 就不会因为重复通知产生无意义渲染。
      if (Object.is(snapshot, nextSnapshot)) {
        return
      }
      snapshot = nextSnapshot
      emit()
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    subscribeSelector: (selector, listener, isEqual = Object.is) => {
      let previousSlice = selector(snapshot)
      const wrappedListener = () => {
        const nextSlice = selector(snapshot)
        // selector 只在切片变化时通知，适合后续 Tree/Table 这类大状态中只关心局部字段的 adapter。
        // 默认 Object.is，不做深比较，避免 core 在高频交互里承担不可控成本。
        if (isEqual(previousSlice, nextSlice)) {
          return
        }
        const currentPreviousSlice = previousSlice
        previousSlice = nextSlice
        listener(nextSlice, currentPreviousSlice)
      }
      listeners.add(wrappedListener)
      return () => {
        listeners.delete(wrappedListener)
      }
    },
  }
}
