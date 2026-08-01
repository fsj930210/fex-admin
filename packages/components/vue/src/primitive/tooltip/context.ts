import type { Tooltip } from '@fex/components-core/tooltip/create-tooltip'
import { inject, type InjectionKey, type ShallowRef } from 'vue'

export interface TooltipContextValue {
  contentId: string
  overlay: Tooltip
  snapshot: ShallowRef<ReturnType<Tooltip['getSnapshot']>>
  triggerElement: ShallowRef<HTMLElement | null>
}
export const tooltipKey: InjectionKey<TooltipContextValue> = Symbol('Tooltip')
export function useTooltipContext(component: string) {
  const context = inject(tooltipKey)
  if (!context) throw new Error(`${component} must be used inside TooltipRoot`)
  return context
}
export function tooltipEventInfo(event: Event) {
  return { target: event.target, currentTarget: event.currentTarget, event }
}
