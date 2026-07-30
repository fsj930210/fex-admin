import { DestroyRef, inject, signal, type Signal } from '@angular/core'

export interface CoreStore<TSnapshot> {
  getSnapshot: () => TSnapshot
  subscribe: (listener: () => void) => () => void
}

export interface CoreStoreSignalBinding<TSnapshot> {
  snapshot: Signal<TSnapshot>
  refresh: () => void
}

export function createCoreStoreSignalBinding<TSnapshot>(
  store: CoreStore<TSnapshot>,
): CoreStoreSignalBinding<TSnapshot> {
  // core store 通过 Angular signal 暴露给 host binding 和模板。
  // snapshot.set 必须写入整份不可变快照，让 OnPush 组件能在绑定读取 signal 时自动刷新。
  const snapshot = signal(store.getSnapshot())
  const refresh = () => snapshot.set(store.getSnapshot())
  const unsubscribe = store.subscribe(refresh)
  inject(DestroyRef).onDestroy(unsubscribe)
  return { snapshot: snapshot.asReadonly(), refresh }
}

export function createCoreStoreSignal<TSnapshot>(store: CoreStore<TSnapshot>) {
  return createCoreStoreSignalBinding(store).snapshot
}
