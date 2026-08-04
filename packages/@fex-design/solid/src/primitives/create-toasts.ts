import { createCoreStoreSignal } from './create-core-store-signal'
import { toast, type SolidToastManager } from '../primitive/toast/toast-manager'

export function createToasts(manager: SolidToastManager = toast) {
  const snapshot = createCoreStoreSignal(manager)
  return {
    clear: manager.clear,
    dismiss: manager.dismiss,
    items: () => snapshot().items,
    pause: manager.pause,
    resume: manager.resume,
  }
}
