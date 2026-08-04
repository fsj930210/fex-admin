import type { Tooltip } from '@fex-design/core/tooltip/create-tooltip'
import type { Readable } from 'svelte/store'
export const tooltipContextKey = Symbol('Tooltip')
export interface TooltipContext {
  contentId: string
  overlay: Tooltip
  snapshot: Readable<ReturnType<Tooltip['getSnapshot']>>
  triggerElement: { current: HTMLElement | null }
}
