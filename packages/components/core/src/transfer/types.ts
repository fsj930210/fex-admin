import type { SnapshotStore } from '../store/create-store'

export type TransferKey = string | number
export type TransferSide = 'source' | 'target'

export type TransferDataItem = Record<string, unknown>

export interface TransferFieldNames {
  key?: string | undefined
  label?: string | undefined
  disabled?: string | undefined
}

export interface TransferResolvedFieldNames {
  key: string
  label: string
  disabled: string
}

export interface TransferCheckedKeys {
  source: readonly TransferKey[]
  target: readonly TransferKey[]
}

export type TransferChangeAction =
  | 'move-to-target'
  | 'move-to-source'
  | 'move-all-to-target'
  | 'move-all-to-source'
  | 'data-change'

export interface TransferChangeMeta<TItem extends TransferDataItem> {
  action: TransferChangeAction
  movedKeys: readonly TransferKey[]
  movedItems: readonly TItem[]
  sourceItems: readonly TItem[]
  targetItems: readonly TItem[]
  previousTargetKeys: readonly TransferKey[]
  previousTargetItems: readonly TItem[]
}

export type TransferCheckedChangeReason = 'check' | 'replace' | 'move' | 'data-change'

export interface TransferCheckedChangeMeta<TItem extends TransferDataItem> {
  side: TransferSide | null
  reason: TransferCheckedChangeReason
  checkedItems: { source: readonly TItem[]; target: readonly TItem[] }
  changedKeys: readonly TransferKey[]
  changedItems: readonly TItem[]
}

export interface TransferSnapshot<TItem extends TransferDataItem> {
  sourceItems: readonly TItem[]
  targetItems: readonly TItem[]
  sourceKeys: readonly TransferKey[]
  targetKeys: readonly TransferKey[]
  sourceCheckedKeys: readonly TransferKey[]
  targetCheckedKeys: readonly TransferKey[]
}

export interface TransferControllerOptions<TItem extends TransferDataItem> {
  items: readonly TItem[]
  fieldNames?: TransferFieldNames | undefined
  disabled?: boolean | undefined
  targetKeys?: readonly TransferKey[] | undefined
  defaultTargetKeys?: readonly TransferKey[] | undefined
  checkedKeys?: Partial<TransferCheckedKeys> | undefined
  defaultCheckedKeys?: Partial<TransferCheckedKeys> | undefined
  onChange?: ((keys: readonly TransferKey[], meta: TransferChangeMeta<TItem>) => void) | undefined
  onCheckedChange?: ((keys: TransferCheckedKeys, meta: TransferCheckedChangeMeta<TItem>) => void) | undefined
}

export interface TransferController<TItem extends TransferDataItem>
  extends SnapshotStore<TransferSnapshot<TItem>> {
  updateOptions(options: Partial<TransferControllerOptions<TItem>>): void
  setSourceCheckedKeys(keys: readonly TransferKey[]): void
  setTargetCheckedKeys(keys: readonly TransferKey[]): void
  moveToTarget(): void
  moveToSource(): void
  moveAllToTarget(): void
  moveAllToSource(): void
  canMoveToTarget(): boolean
  canMoveToSource(): boolean
  canMoveAllToTarget(): boolean
  canMoveAllToSource(): boolean
}
