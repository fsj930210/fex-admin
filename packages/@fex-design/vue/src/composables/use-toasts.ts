import { computed } from 'vue'
import { useCoreStore } from './use-core-store'
import { toast, type VueToastManager } from '../primitive/toast/toast-manager'

export function useToasts(manager: VueToastManager = toast) {
  const snapshot = useCoreStore(manager)
  return {
    clear: manager.clear,
    dismiss: manager.dismiss,
    items: computed(() => snapshot.value.items),
    pause: manager.pause,
    resume: manager.resume,
  }
}
