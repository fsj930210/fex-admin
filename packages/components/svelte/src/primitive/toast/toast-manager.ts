import { createToastManager, type ToastItem, type ToastManager } from '@fex/components-core/toast/create-toast-manager'
import type { Snippet } from 'svelte'

export type SvelteToastContent = string | Snippet | undefined | null
export type SvelteToastItem = ToastItem<SvelteToastContent>
export type SvelteToastManager = ToastManager<SvelteToastContent>

export const toast = createToastManager<SvelteToastContent>()

export { createToastManager }
