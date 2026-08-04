import type { Tooltip } from '@fex-design/core/tooltip/create-tooltip'
import { createContext, useContext, type Accessor } from 'solid-js'
export interface TooltipContextValue {
  contentId: string
  overlay: Tooltip
  snapshot: Accessor<ReturnType<Tooltip['getSnapshot']>>
  triggerElement: { current: HTMLElement | null }
}
export const TooltipContext = createContext<TooltipContextValue>()
export function useTooltip(component: string) {
  const context = useContext(TooltipContext)
  if (!context) throw new Error(`${component} must be used inside Tooltip`)
  return context
}
