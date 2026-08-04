import { readableCoreStore } from './core-store'
import { toast, type SvelteToastManager } from '../primitive/toast/toast-manager'

export function createToastStore(manager: SvelteToastManager = toast) {
  return readableCoreStore(manager)
}
