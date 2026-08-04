import { createSignal, onCleanup, type Accessor } from 'solid-js'

export interface CoreStore<TSnapshot> {
  getSnapshot: () => TSnapshot
  subscribe: (listener: () => void) => () => void
}

export function createCoreStoreSignal<TSnapshot>(store: CoreStore<TSnapshot>): Accessor<TSnapshot> {
  // Solid 通过 accessor 建立依赖追踪，所以 adapter 必须在 JSX 或派生函数里调用 snapshot()。
  // 如果初始化时写 const open = snapshot().open，后续 core 通知不会重新执行条件渲染。
  const [snapshot, setSnapshot] = createSignal(store.getSnapshot())
  const unsubscribe = store.subscribe(() => {
    setSnapshot(() => store.getSnapshot())
  })
  onCleanup(unsubscribe)
  return snapshot
}
