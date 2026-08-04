import { useCoreStore } from './use-core-store'
import { toast, type ReactToastManager } from '../primitive/toast/toast-manager'

export function useToasts(manager: ReactToastManager = toast) {
  const snapshot = useCoreStore(manager)
  return {
    clear: manager.clear,
    dismiss: manager.dismiss,
    items: snapshot.items,
    pause: manager.pause,
    resume: manager.resume,
  }
}
