import type { SnapshotStore } from '../store/create-store'

export type TabsValue = string
export type TabsOrientation = 'horizontal' | 'vertical'
export type TabsActivationMode = 'automatic' | 'manual'

export interface TabsItemRecord {
  value: TabsValue
  disabled?: boolean
  closable?: boolean
}

export interface TabsChangeMeta {
  previousValue: TabsValue | undefined
  cause: 'click' | 'keyboard' | 'programmatic'
}

export interface TabsSnapshot {
  value: TabsValue | undefined
  focusedValue: TabsValue | undefined
  visitedValues: ReadonlySet<TabsValue>
}

export interface TabsControllerOptions {
  value?: TabsValue | undefined
  defaultValue?: TabsValue | undefined
  orientation?: TabsOrientation | undefined
  activationMode?: TabsActivationMode | undefined
  loop?: boolean | undefined
  onChange?: ((value: TabsValue | undefined, meta: TabsChangeMeta) => void) | undefined
}

export interface TabsController extends SnapshotStore<TabsSnapshot> {
  updateOptions: (options: TabsControllerOptions) => void
  registerItem: (item: TabsItemRecord) => void
  selectFirstAvailable: () => TabsValue | undefined
  unregisterItem: (value: TabsValue) => void
  select: (value: TabsValue | undefined, cause?: TabsChangeMeta['cause']) => void
  focus: (value: TabsValue | undefined, cause?: TabsChangeMeta['cause']) => void
  moveFocus: (direction: 'next' | 'previous' | 'first' | 'last') => TabsValue | undefined
  isContentMounted: (value: TabsValue) => boolean
}
