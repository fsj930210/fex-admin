import { createTooltip, getTooltipArrowPosition, type TooltipOptions } from '@fex/components-core/tooltip/create-tooltip'
import { tooltipArrowClassName, tooltipContentClassName } from '@fex/components-styles/tooltip'
import { cn } from '@fex/utils'
import { Portal } from 'solid-js/web'
import { createEffect, createSignal, createUniqueId, onCleanup, Show, splitProps, type JSX, type ParentProps } from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'
import { TooltipContext, useTooltip } from './tooltip-context'

const eventInfo = (event: Event) => ({ target: event.target, currentTarget: event.currentTarget, event })
export interface TooltipRootProps extends ParentProps, TooltipOptions {}
export function TooltipRoot(props: TooltipRootProps) {
  const [local, rest] = splitProps(props, ['children', 'open', 'defaultOpen', 'onOpenChange'])
  const [open, setOpen] = createSignal(local.open ?? local.defaultOpen ?? false)
  let overlay: ReturnType<typeof createTooltip>
  function options(): TooltipOptions { return { ...rest, open: local.open ?? open(), onOpenChange(nextOpen, info) { if (local.open === undefined) setOpen(nextOpen); local.onOpenChange?.(nextOpen, info) } } }
  overlay = createTooltip(options())
  const snapshot = createCoreStoreSignal(overlay)
  const triggerElement = { current: null as HTMLElement | null }
  const contentId = `fex-tooltip-${createUniqueId()}`
  createEffect(() => overlay.setOptions(options()))
  onCleanup(() => overlay.destroy())
  return <TooltipContext.Provider value={{ contentId, overlay, snapshot, triggerElement }}>{local.children}</TooltipContext.Provider>
}

export interface TooltipTriggerRenderProps {
  props: { 'aria-describedby': string | undefined; 'data-state': 'open' | 'closed'; onBlur: JSX.FocusEventHandlerUnion<HTMLElement, FocusEvent>; onFocus: JSX.FocusEventHandlerUnion<HTMLElement, FocusEvent>; onPointerEnter: JSX.EventHandlerUnion<HTMLElement, PointerEvent>; onPointerLeave: JSX.EventHandlerUnion<HTMLElement, PointerEvent> }
  ref: (element: HTMLElement) => void
  state: ReturnType<ReturnType<typeof createTooltip>['getSnapshot']>
}
export function TooltipTrigger(props: { children: (props: TooltipTriggerRenderProps) => JSX.Element }) {
  const { contentId, overlay, snapshot, triggerElement } = useTooltip('TooltipTrigger')
  createEffect(() => {
    const element = triggerElement.current
    if (!element) return
    element.dataset.state = snapshot().open ? 'open' : 'closed'
    if (snapshot().mounted) element.setAttribute('aria-describedby', contentId)
    else element.removeAttribute('aria-describedby')
  })
  onCleanup(() => { triggerElement.current = null; overlay.setReferenceElement(null) })
  return props.children({ ref(element) { triggerElement.current = element; overlay.setReferenceElement(element) }, state: snapshot(), props: {
    'aria-describedby': snapshot().mounted ? contentId : undefined, 'data-state': snapshot().open ? 'open' : 'closed',
    onPointerEnter: (event) => overlay.trigger.pointerEnter(eventInfo(event)), onPointerLeave: (event) => overlay.trigger.pointerLeave(eventInfo(event)),
    onFocus: (event) => overlay.trigger.focus(eventInfo(event)), onBlur: (event) => overlay.trigger.blur(eventInfo(event)),
  } })
}
export function TooltipPortal(props: ParentProps) {
  const { overlay, snapshot } = useTooltip('TooltipPortal')
  return <Show when={snapshot().mounted}><Portal mount={overlay.resolvePopupContainer() ?? document.body}>{props.children}</Portal></Show>
}
export interface TooltipContentProps extends ParentProps { class?: string; style?: string }
export function TooltipContent(props: TooltipContentProps) {
  const [local] = splitProps(props, ['children', 'class', 'style'])
  const { contentId, overlay, snapshot } = useTooltip('TooltipContent')
  onCleanup(() => overlay.setFloatingElement(null))
  return <Show when={snapshot().mounted}><div id={contentId} ref={(element) => queueMicrotask(() => element.isConnected && overlay.setFloatingElement(element))}
    role="tooltip" data-slot="tooltip-content" data-state={snapshot().open ? 'open' : 'closed'} data-phase={snapshot().phase}
    data-side={snapshot().side} data-align={snapshot().align} data-placement={snapshot().placement}
    class={cn(tooltipContentClassName, local.class)} style={`position: var(--floating-strategy, absolute); left: var(--floating-x, 0px); top: var(--floating-y, 0px); transform-origin: var(--floating-transform-origin); ${local.style ?? ''}`}>{local.children}</div></Show>
}
export function TooltipArrow(props: { class?: string }) {
  const { overlay, snapshot } = useTooltip('TooltipArrow')
  onCleanup(() => overlay.setArrowElement(null))
  const style = () => getTooltipArrowPosition(snapshot().side, snapshot().align)
  return <div ref={(element) => overlay.setArrowElement(element)} data-slot="tooltip-arrow" data-side={snapshot().side} data-align={snapshot().align} class={cn(tooltipArrowClassName, props.class)} style={style()} />
}
export { useTooltip } from './tooltip-context'
