import type { CSSProperties, FocusEvent, HTMLAttributes, PointerEvent, Ref } from 'react'
import { tooltipArrowClassName, tooltipContentClassName } from '@fex/components-styles/tooltip'
import { getTooltipArrowPosition } from '@fex/components-core/tooltip/create-tooltip'
import { cn } from '@fex/utils'
import { useComposedRef } from '../../hooks/use-composed-ref'
import { useCoreStore } from '../../hooks/use-core-store'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
import { useTooltipContext } from './tooltip-context'

function eventInfo(event: PointerEvent<HTMLElement> | FocusEvent<HTMLElement>) {
  return { target: event.target, currentTarget: event.currentTarget, event }
}

export function useTooltip(component = 'useTooltip') {
  const context = useTooltipContext(component)
  const snapshot = useCoreStore(context.overlay)
  return { ...context, snapshot }
}

export interface UseTooltipTriggerProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
}

export function useTooltipTrigger({
  ref,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: UseTooltipTriggerProps = {}) {
  const { contentId, overlay, snapshot, triggerRef } = useTooltip('useTooltipTrigger')
  const setReference = useMemoizedFn((element: HTMLElement | null) => {
    triggerRef.current = element
    overlay.setReferenceElement(element)
  })
  const composedRef = useComposedRef(setReference, ref)
  return {
    snapshot,
    props: {
      ...props,
      ref: composedRef,
      'aria-describedby': snapshot.mounted
        ? [props['aria-describedby'], contentId].filter(Boolean).join(' ')
        : props['aria-describedby'],
      'data-state': snapshot.open ? ('open' as const) : ('closed' as const),
      onPointerEnter: (event: PointerEvent<HTMLElement>) => {
        onPointerEnter?.(event)
        if (!event.defaultPrevented) overlay.trigger.pointerEnter(eventInfo(event))
      },
      onPointerLeave: (event: PointerEvent<HTMLElement>) => {
        onPointerLeave?.(event)
        if (!event.defaultPrevented) overlay.trigger.pointerLeave(eventInfo(event))
      },
      onFocus: (event: FocusEvent<HTMLElement>) => {
        onFocus?.(event)
        if (!event.defaultPrevented) overlay.trigger.focus(eventInfo(event))
      },
      onBlur: (event: FocusEvent<HTMLElement>) => {
        onBlur?.(event)
        if (!event.defaultPrevented) overlay.trigger.blur(eventInfo(event))
      },
    },
  }
}

export function useTooltipContent({ ref, className, style, ...props }: HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> }) {
  const { contentId, overlay, snapshot } = useTooltip('useTooltipContent')
  const setContent = useMemoizedFn((element: HTMLDivElement | null) => overlay.setFloatingElement(element))
  const composedRef = useComposedRef(setContent, ref)
  if (!snapshot.mounted) return { mounted: false as const, props: null, snapshot }
  return { mounted: true as const, snapshot, props: {
    ...props,
    id: contentId,
    ref: composedRef,
    role: 'tooltip',
    'data-slot': 'tooltip-content',
    'data-state': snapshot.open ? ('open' as const) : ('closed' as const),
    'data-phase': snapshot.phase,
    'data-side': snapshot.side,
    'data-align': snapshot.align,
    'data-placement': snapshot.placement,
    className: cn(tooltipContentClassName, className),
    style: { position: 'var(--floating-strategy, absolute)', left: 'var(--floating-x, 0px)', top: 'var(--floating-y, 0px)', transformOrigin: 'var(--floating-transform-origin)', ...style } as CSSProperties,
  }}
}

export function useTooltipArrow({ ref, className, style, ...props }: HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> }) {
  const { overlay, snapshot } = useTooltip('useTooltipArrow')
  const setArrow = useMemoizedFn((element: HTMLDivElement | null) => overlay.setArrowElement(element))
  const composedRef = useComposedRef(setArrow, ref)
  const position = getTooltipArrowPosition(snapshot.side, snapshot.align)
  return { snapshot, props: { ...props, ref: composedRef, 'data-slot': 'tooltip-arrow', 'data-side': snapshot.side, 'data-align': snapshot.align, className: cn(tooltipArrowClassName, className), style: { ...position, ...style } as CSSProperties } }
}
