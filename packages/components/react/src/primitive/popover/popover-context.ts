import { createContext, use } from 'react'
import type { FloatingOverlay } from '@fex/components-core/overlay/create-floating-overlay'
import type { RefObject } from 'react'

export interface PopoverContextValue {
  arrow: boolean
  arrowRef: RefObject<HTMLElement | null>
  overlay: FloatingOverlay
  triggerRef: RefObject<HTMLElement | null>
}

export const PopoverContext = createContext<PopoverContextValue | null>(null)

export function usePopoverContext(component: string) {
  const context = use(PopoverContext)
  if (!context) throw new Error(`${component} must be used inside PopoverRoot`)
  return context
}
