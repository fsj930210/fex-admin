import {
  createToastManager,
  type ToastItem,
  type ToastManager,
} from '@fex-design/core/toast/create-toast-manager'
import type { ReactNode } from 'react'

export type ReactToastItem = ToastItem<ReactNode>
export type ReactToastManager = ToastManager<ReactNode>

export const toast = createToastManager<ReactNode>()

export { createToastManager }
