import {
  createFloatingOverlay,
  type FloatingOverlay,
  type FloatingOverlayOptions,
} from '../overlay/create-floating-overlay'
import type { FloatingAlign, FloatingSide } from '../floating/placement'

export interface TooltipOptions
  extends Omit<
    FloatingOverlayOptions,
    'allowedTriggers' | 'arrow' | 'dismiss' | 'modal' | 'trigger'
  > {}

export type Tooltip = Omit<FloatingOverlay, 'setOptions'> & {
  setOptions: (options: TooltipOptions) => void
}

export function getTooltipArrowPosition(side: FloatingSide, align: FloatingAlign) {
  const edgeOffset =
    side === 'left' || side === 'right'
      ? 'var(--tooltip-arrow-edge-offset-y, clamp(14px, 25%, 24px))'
      : 'var(--tooltip-arrow-edge-offset-x, clamp(16px, 25%, 32px))'
  const position =
    align === 'start'
      ? edgeOffset
      : align === 'end'
        ? `calc(100% - ${edgeOffset})`
        : side === 'left' || side === 'right'
          ? 'calc(var(--floating-arrow-y, calc(50% - 4px)) + var(--tooltip-arrow-half-size, 4px))'
          : 'calc(var(--floating-arrow-x, calc(50% - 4px)) + var(--tooltip-arrow-half-size, 4px))'

  return side === 'left' || side === 'right' ? { top: position } : { left: position }
}

function toFloatingOverlayOptions(options: TooltipOptions): FloatingOverlayOptions {
  return {
    ...options,
    // Tooltip is a non-interactive description. Its trigger contract is deliberately narrower
    // than Popover so adapters cannot accidentally add click or context-menu behavior.
    trigger: ['hover', 'focus'],
    allowedTriggers: ['hover', 'focus'],
    arrow: true,
    arrowPadding: options.arrowPadding ?? 8,
    modal: false,
    dismiss: { escapeKey: true, outsidePointer: false },
    placement: options.placement ?? 'top',
    sideOffset: options.sideOffset ?? 6,
    hoverOpenDelay: options.hoverOpenDelay ?? 400,
    hoverCloseDelay: options.hoverCloseDelay ?? 100,
    closeDelay: options.closeDelay ?? 100,
  }
}

export function createTooltip(options: TooltipOptions = {}): Tooltip {
  const overlay = createFloatingOverlay(toFloatingOverlayOptions(options))
  return {
    ...overlay,
    setOptions: (nextOptions) => overlay.setOptions(toFloatingOverlayOptions(nextOptions)),
  }
}
