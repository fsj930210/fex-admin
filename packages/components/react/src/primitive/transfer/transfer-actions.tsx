import type { HTMLAttributes, ReactNode } from 'react'
import { useTransfer } from './use-transfer'

export interface TransferActionsApi {
  moveToTarget(): void
  moveToSource(): void
  moveAllToTarget(): void
  moveAllToSource(): void
  canMoveToTarget: boolean
  canMoveToSource: boolean
  canMoveAllToTarget: boolean
  canMoveAllToSource: boolean
}

export interface TransferActionsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode | ((api: TransferActionsApi) => ReactNode)
}

export function TransferActions({ children, ...props }: TransferActionsProps) {
  const { controller } = useTransfer()
  const api: TransferActionsApi = {
    moveToTarget: controller.moveToTarget,
    moveToSource: controller.moveToSource,
    moveAllToTarget: controller.moveAllToTarget,
    moveAllToSource: controller.moveAllToSource,
    canMoveToTarget: controller.canMoveToTarget(),
    canMoveToSource: controller.canMoveToSource(),
    canMoveAllToTarget: controller.canMoveAllToTarget(),
    canMoveAllToSource: controller.canMoveAllToSource(),
  }
  return (
    <div {...props} data-slot="transfer-actions">
      {typeof children === 'function' ? children(api) : children}
    </div>
  )
}
