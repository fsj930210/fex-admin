import { inject } from 'vue'
import { cascaderKey } from './context'

export function useCascader(part: string) {
  const context = inject(cascaderKey)
  if (!context) throw new Error(`${part} must be used inside CascaderRoot.`)
  return context
}
