import { useSyncExternalStore } from 'react'
import type { SnapshotStore } from '@fex/components-core/store/create-store'

export function useCoreStore<TSnapshot>(store: SnapshotStore<TSnapshot>) {
  // core store 是 React 外部的命令式状态源，必须用 useSyncExternalStore 桥接。
  // 这个 API 会让并发渲染读取到一致快照；如果改成 useState + useEffect 订阅，
  // 首次渲染和订阅建立之间可能短暂读到旧值，Popover 的 mounted/open 会出现闪烁。
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
}
