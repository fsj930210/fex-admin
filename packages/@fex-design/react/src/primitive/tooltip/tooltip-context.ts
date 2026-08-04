import { createContext, use } from 'react'
import type { RefObject } from 'react'
import type { Tooltip } from '@fex-design/core/tooltip/create-tooltip'

export interface TooltipContextValue {
  contentId: string
  overlay: Tooltip
  triggerRef: RefObject<HTMLElement | null>
}

export const TooltipContext = createContext<TooltipContextValue | null>(null)

export function useTooltipContext(component: string) {
  const context = use(TooltipContext)
  if (!context) throw new Error(`${component} must be used within TooltipRoot`)
  return context
}
