import type { TransferDataItem, TransferKey, TransferSide } from '@fex/components-core/transfer/types'
import { useCoreStore } from '../../hooks/use-core-store'
import { useTransferContext, useTransferPanelSide } from './transfer-context'

export function useTransfer<TItem extends TransferDataItem = TransferDataItem>() {
  const context = useTransferContext<TItem>('useTransfer')
  const snapshot = useCoreStore(context.controller)
  return { ...context, snapshot }
}

export function useTransferPanel<TItem extends TransferDataItem = TransferDataItem>() {
  const transfer = useTransfer<TItem>()
  const side = useTransferPanelSide('useTransferPanel')
  const source = side === 'source'
  const items = source ? transfer.snapshot.sourceItems : transfer.snapshot.targetItems
  const checkedKeys = source ? transfer.snapshot.sourceCheckedKeys : transfer.snapshot.targetCheckedKeys
  const setCheckedKeys = source
    ? transfer.controller.setSourceCheckedKeys
    : transfer.controller.setTargetCheckedKeys

  return {
    side,
    items,
    checkedKeys,
    setCheckedKeys,
    isChecked: (key: TransferKey) => checkedKeys.includes(key),
  }
}

export interface TransferPanelRenderApi<TItem extends TransferDataItem> {
  side: TransferSide
  items: readonly TItem[]
  checkedKeys: readonly TransferKey[]
  setCheckedKeys(keys: readonly TransferKey[]): void
  isChecked(key: TransferKey): boolean
}
