import { createToastManager, type ToastItem, type ToastManager } from '@fex/components-core/toast/create-toast-manager'
import type { JSX } from 'solid-js'

export type SolidToastContent = JSX.Element
export type SolidToastItem = ToastItem<SolidToastContent>
export type SolidToastManager = ToastManager<SolidToastContent>

export const toast = createToastManager<SolidToastContent>()

export { createToastManager }
