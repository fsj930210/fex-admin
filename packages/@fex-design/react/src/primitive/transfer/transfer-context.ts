import type {
  TransferController,
  TransferDataItem,
  TransferSide,
} from '@fex-design/core/transfer/types'
import { createContext, use } from 'react'

export interface TransferContextValue<TItem extends TransferDataItem> {
  controller: TransferController<TItem>
  disabled: boolean
}

export const TransferContext = createContext<TransferContextValue<TransferDataItem> | null>(null)
export const TransferPanelContext = createContext<TransferSide | null>(null)

export function useTransferContext<TItem extends TransferDataItem>(component: string) {
  const context = use(TransferContext)
  if (!context) throw new Error(`${component} must be used inside TransferRoot.`)
  return context as TransferContextValue<TItem>
}

export function useTransferPanelSide(component: string) {
  const side = use(TransferPanelContext)
  if (!side) throw new Error(`${component} must be used inside a Transfer panel.`)
  return side
}
