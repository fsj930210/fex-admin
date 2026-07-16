import {
  createToastManager,
  type ToastItem,
  type ToastManager,
} from '@fex/components-core/toast/create-toast-manager'
import type { VNodeChild } from 'vue'

export type VueToastContent = VNodeChild
export type VueToastItem = ToastItem<VueToastContent>
export type VueToastManager = ToastManager<VueToastContent>

export const toast = createToastManager<VueToastContent>()

export { createToastManager }
