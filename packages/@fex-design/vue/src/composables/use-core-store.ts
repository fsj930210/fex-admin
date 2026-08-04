import { onScopeDispose, shallowRef, type ShallowRef } from 'vue'

export interface CoreStore<TSnapshot> {
  getSnapshot: () => TSnapshot
  subscribe: (listener: () => void) => () => void
}

export function useCoreStore<TSnapshot>(store: CoreStore<TSnapshot>): ShallowRef<TSnapshot> {
  // core snapshot 是不可变对象，Vue 只需要追踪 snapshot 引用变化。
  // 这里使用 shallowRef，避免 Vue 深度代理 core 内部对象；adapter 必须通过 snapshot.value.xxx 读取，
  // 不能提前解构，否则模板可能拿不到后续订阅更新。
  const snapshot = shallowRef(store.getSnapshot()) as ShallowRef<TSnapshot>
  const unsubscribe = store.subscribe(() => {
    snapshot.value = store.getSnapshot()
  })
  onScopeDispose(unsubscribe)
  return snapshot
}
