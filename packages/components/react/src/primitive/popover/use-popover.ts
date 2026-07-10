import type { CSSProperties, FocusEvent, KeyboardEvent, MouseEvent, PointerEvent } from 'react'
import { popoverArrowClassName, popoverContentClassName } from '@fex/components-styles/popover'
import { cn } from '@fex/utils'
import { useComposedRef } from '../../hooks/use-composed-ref'
import { useCoreStore } from '../../hooks/use-core-store'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
import type { PopoverArrowProps, PopoverContentProps, PopoverTriggerRenderProps, UsePopoverTriggerProps } from './popover'
import { usePopoverContext } from './popover-context'

export function usePopover(component = 'usePopover') {
  const context = usePopoverContext(component)
  const snapshot = useCoreStore(context.overlay)
  return { ...context, snapshot }
}

function toEventInfo(event: MouseEvent<HTMLElement> | PointerEvent<HTMLElement> | FocusEvent<HTMLElement>) {
  return {
    target: event.target,
    currentTarget: event.currentTarget,
    clientX: 'clientX' in event ? event.clientX : undefined,
    clientY: 'clientY' in event ? event.clientY : undefined,
    button: 'button' in event ? event.button : undefined,
    pointerType: 'pointerType' in event ? event.pointerType : undefined,
    event,
    preventDefault: event.preventDefault.bind(event),
    stopPropagation: event.stopPropagation.bind(event),
  }
}

export function usePopoverTrigger({ ref, onClick, onPointerEnter, onPointerLeave, onMouseEnter, onMouseLeave, onFocus, onBlur, onContextMenu, ...props }: UsePopoverTriggerProps) {
  const { overlay, snapshot, triggerRef } = usePopover('usePopoverTrigger')
  const setReference = useMemoizedFn((element: HTMLButtonElement | null) => {
    triggerRef.current = element
    overlay.setReferenceElement(element)
  })
  const syncReferenceFromEvent = useMemoizedFn((event: MouseEvent<HTMLButtonElement> | PointerEvent<HTMLButtonElement> | FocusEvent<HTMLButtonElement>) => {
    triggerRef.current = event.currentTarget
    overlay.setReferenceElement(event.currentTarget)
  })
  const composedRef = useComposedRef<HTMLButtonElement>(setReference, ref)
  const triggerProps: PopoverTriggerRenderProps = {
    ...props,
    ref: composedRef,
    'aria-haspopup': 'dialog',
    'aria-expanded': snapshot.open,
    'data-state': snapshot.open ? 'open' : 'closed',
    onClick: (event) => {
      onClick?.(event)
      if (!event.defaultPrevented && snapshot.trigger.includes('click')) {
        syncReferenceFromEvent(event)
        overlay.trigger.click(toEventInfo(event))
      }
    },
    onPointerEnter: (event) => {
      onPointerEnter?.(event)
      if (!event.defaultPrevented) { syncReferenceFromEvent(event); overlay.trigger.pointerEnter(toEventInfo(event)) }
    },
    onPointerLeave: (event) => {
      onPointerLeave?.(event)
      if (!event.defaultPrevented) { syncReferenceFromEvent(event); overlay.trigger.pointerLeave(toEventInfo(event)) }
    },
    onMouseEnter: (event) => {
      onMouseEnter?.(event)
      if (!event.defaultPrevented) { syncReferenceFromEvent(event); overlay.trigger.pointerEnter(toEventInfo(event)) }
    },
    onMouseLeave: (event) => {
      onMouseLeave?.(event)
      if (!event.defaultPrevented) { syncReferenceFromEvent(event); overlay.trigger.pointerLeave(toEventInfo(event)) }
    },
    onFocus: (event) => {
      onFocus?.(event)
      if (!event.defaultPrevented) { syncReferenceFromEvent(event); overlay.trigger.focus(toEventInfo(event)) }
    },
    onBlur: (event) => {
      onBlur?.(event)
      if (!event.defaultPrevented) { syncReferenceFromEvent(event); overlay.trigger.blur(toEventInfo(event)) }
    },
    onContextMenu: (event) => {
      onContextMenu?.(event)
      if (!event.defaultPrevented) { syncReferenceFromEvent(event); overlay.trigger.contextMenu(toEventInfo(event)) }
    },
  }
  return { props: triggerProps, snapshot }
}

export function usePopoverContent({ ref, className, style, onPointerEnter, onPointerLeave, onKeyDown, ...props }: PopoverContentProps) {
  const { overlay, snapshot } = usePopover('usePopoverContent')
  const setContentElement = useMemoizedFn((element: HTMLDivElement | null) => overlay.setFloatingElement(element))
  const composedRef = useComposedRef<HTMLDivElement>(setContentElement, ref)
  if (!snapshot.mounted) return { mounted: false as const, props: null, snapshot }
  return {
    mounted: true as const,
    snapshot,
    props: {
      ...props,
      ref: composedRef,
      role: 'dialog' as const,
      tabIndex: -1,
      'data-slot': 'popover-content',
      'data-state': snapshot.open ? 'open' as const : 'closed' as const,
      'data-phase': snapshot.phase,
      'data-side': snapshot.side,
      'data-align': snapshot.align,
      'data-placement': snapshot.placement,
      className: cn(popoverContentClassName(), className),
      style: { position: 'var(--floating-strategy, absolute)', left: 'var(--floating-x, 0px)', top: 'var(--floating-y, 0px)', transformOrigin: 'var(--floating-transform-origin)', ...style } as CSSProperties,
      onPointerEnter: (event: PointerEvent<HTMLDivElement>) => { onPointerEnter?.(event); overlay.content.pointerEnter(toEventInfo(event)) },
      onPointerLeave: (event: PointerEvent<HTMLDivElement>) => { onPointerLeave?.(event); overlay.content.pointerLeave(toEventInfo(event)) },
      onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => onKeyDown?.(event),
    },
  }
}

export function usePopoverArrow({ ref, className, style, ...props }: PopoverArrowProps) {
  const { arrowRef, overlay, arrow, snapshot } = usePopover('usePopoverArrow')
  const setArrowElement = useMemoizedFn((element: HTMLDivElement | null) => {
    arrowRef.current = element
    overlay.setArrowElement(element)
  })
  const composedRef = useComposedRef<HTMLDivElement>(setArrowElement, ref)
  if (!arrow) return { mounted: false as const, props: null, snapshot }
  const floatingArrowStyle = snapshot.side === 'left' || snapshot.side === 'right'
    ? { top: 'clamp(var(--popover-arrow-inset,32px), var(--floating-arrow-y,50%), calc(100% - var(--popover-arrow-inset,32px)))' }
    : { left: 'clamp(var(--popover-arrow-inset,32px), var(--floating-arrow-x,50%), calc(100% - var(--popover-arrow-inset,32px)))' }
  return {
    mounted: true as const,
    snapshot,
    props: { ...props, ref: composedRef, 'data-slot': 'popover-arrow', 'data-side': snapshot.side, className: cn(popoverArrowClassName, className), style: { ...floatingArrowStyle, ...style } as CSSProperties },
  }
}
