import { createFloating } from '@fex-design/core/floating/create-floating'
import { createTourController } from '@fex-design/core/tour/create-tour-controller'
import type { TourOptions, TourStepOptions } from '@fex-design/core/tour/types'
import { tourArrowClassName, tourContentClassName, tourControlClassName, tourOverlayClassName } from '@fex-design/styles/tour'
import { cn } from '@fex/utils'
import { Portal } from 'solid-js/web'
import { createEffect, createMemo, onCleanup, onMount, Show, type JSX, type ParentProps } from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'
import { TourContentContext, TourContext, useTourContentContext, useTourContext } from './tour-context'

export interface TourRootProps<TData = unknown> extends ParentProps, TourOptions<TData> { keyboard?: boolean; overlay?: boolean; closeOnOverlayClick?: boolean; defaultGap?: number; zIndex?: number; getPopupContainer?: (referenceElement: HTMLElement | null) => HTMLElement }
export function TourRoot<TData = unknown>(props: TourRootProps<TData>) {
  const controller = createTourController<TData>(props)
  const snapshot = createCoreStoreSignal(controller)
  const update = () => controller.setOptions({ open: props.open, defaultOpen: props.defaultOpen, current: props.current, defaultCurrent: props.defaultCurrent, targetMissing: props.targetMissing, targetTimeout: props.targetTimeout, onOpenChange: props.onOpenChange, onChange: props.onChange, onClose: props.onClose, onFinish: props.onFinish, onTargetMissing: props.onTargetMissing })
  createEffect(update)
  const refresh = () => controller.refreshTarget()
  onMount(() => { window.addEventListener('resize', refresh); window.addEventListener('scroll', refresh, true) })
  onCleanup(() => { window.removeEventListener('resize', refresh); window.removeEventListener('scroll', refresh, true); controller.destroy() })
  function keydown(event: KeyboardEvent) {
    if (!snapshot().open || props.keyboard === false) return
    if (event.key === 'Escape') { event.preventDefault(); controller.close() }
    else if (event.key === 'ArrowRight') { event.preventDefault(); void controller.next() }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); void controller.previous() }
  }
  onMount(() => { document.addEventListener('keydown', keydown); onCleanup(() => document.removeEventListener('keydown', keydown)) })
  return <TourContext.Provider value={{ controller, snapshot, overlay: props.overlay ?? true, closeOnOverlayClick: props.closeOnOverlayClick ?? true, defaultGap: props.defaultGap ?? 6, zIndex: props.zIndex ?? 1001, getPopupContainer: props.getPopupContainer }}>{props.children}</TourContext.Provider>
}

export interface TourStepProps<TData = unknown> extends ParentProps, TourStepOptions<TData> {}
export function TourStep<TData = unknown>(props: TourStepProps<TData>) {
  const { controller, snapshot } = useTourContext('TourStep')
  createEffect(() => {
    const step: TourStepOptions<TData> = { name: props.name, target: props.target, placement: props.placement, arrow: props.arrow, mask: props.mask, gap: props.gap, scrollIntoViewOptions: props.scrollIntoViewOptions, disabledInteraction: props.disabledInteraction, data: props.data }
    const unregister = controller.registerStep(step)
    onCleanup(unregister)
  })
  return <Show when={snapshot().currentStep?.name === props.name}>{props.children}</Show>
}

export interface TourTargetProps { name: string; children: (props: { ref: (element: HTMLElement) => void; state: ReturnType<ReturnType<typeof createTourController>['getSnapshot']>; props: { 'data-tour-target': string } }) => JSX.Element }
export function TourTarget(props: TourTargetProps) {
  const { controller, snapshot } = useTourContext('TourTarget')
  let element: HTMLElement | null = null
  const unregister = controller.registerTarget(props.name, () => element)
  onCleanup(() => { unregister(); controller.refreshTarget() })
  return props.children({ ref: (value: HTMLElement) => { element = value; controller.refreshTarget() }, state: snapshot, props: { 'data-tour-target': props.name } })
}

export function TourPortal(props: ParentProps & { container?: HTMLElement | null }) {
  const { controller, snapshot, getPopupContainer } = useTourContext('TourPortal')
  const target = createMemo(() => snapshot().currentStep?.target ? controller.getTarget(snapshot().currentStep!.target!) : null)
  return <Portal mount={props.container ?? getPopupContainer?.(target()) ?? document.body}>{props.children}</Portal>
}

export interface TourContentProps extends ParentProps { class?: string; style?: JSX.CSSProperties }
export function TourContent(props: TourContentProps) {
  const { controller, snapshot, defaultGap, zIndex } = useTourContext('TourContent')
  const floating = createFloating({ placement: 'bottom', arrow: true, offset: 12 })
  const floatingSnapshot = createCoreStoreSignal(floating)
  let content: HTMLDivElement | null = null
  const step = createMemo(() => snapshot().currentStep)
  const target = createMemo(() => step()?.target ? controller.getTarget(step()!.target!) : null)
  const gap = createMemo(() => step()?.gap?.offset ?? defaultGap)
  createEffect(() => {
    const offset = (Array.isArray(gap()) ? Math.max(...gap() as [number, number]) : gap()) + 12
    floating.setOptions({ placement: step()?.placement ?? 'bottom', arrow: step()?.arrow !== false, offset })
    floating.setReferenceElement(target())
    if (snapshot().open && target()) floating.startAutoUpdate(); else floating.stopAutoUpdate()
  })
  onCleanup(() => { floating.setFloatingElement(null); floating.destroy() })
  const setContent = (value: HTMLDivElement) => { content = value; queueMicrotask(() => { if (content?.isConnected) floating.setFloatingElement(content) }) }
  return <Show when={snapshot().open && step()}><TourContentContext.Provider value={{ floating, snapshot: floatingSnapshot }}><div ref={setContent} role="dialog" tabIndex={-1} data-slot="tour-content" data-side={floatingSnapshot().side} data-placement={floatingSnapshot().placement} class={cn(tourContentClassName, props.class)} style={{ position: 'var(--floating-strategy, absolute)', left: 'var(--floating-x, 0px)', top: 'var(--floating-y, 0px)', 'transform-origin': 'var(--floating-transform-origin)', 'z-index': zIndex, ...props.style }}>{props.children}</div></TourContentContext.Provider></Show>
}

export function TourOverlay(props: { children?: (value: { props: JSX.HTMLAttributes<HTMLDivElement>; targetRect: DOMRect | null; gap: number | [number, number]; color: string }) => JSX.Element; class?: string; style?: JSX.CSSProperties }) {
  const { snapshot, overlay, closeOnOverlayClick, controller, defaultGap, zIndex } = useTourContext('TourOverlay')
  const step = createMemo(() => snapshot().currentStep)
  const gap = createMemo(() => step()?.gap?.offset ?? defaultGap)
  const color = createMemo(() => typeof step()?.mask === 'object' && step()?.mask?.color ? step()?.mask?.color : 'rgba(15, 23, 42, 0.58)')
  const rect = createMemo(() => { const target = snapshot().targetRect; if (!target) return null; const x = Array.isArray(gap()) ? gap()[0] : gap(); const y = Array.isArray(gap()) ? gap()[1] : gap(); return { x: target.x - x, y: target.y - y, width: target.width + x * 2, height: target.height + y * 2 } })
  const click = (event: MouseEvent) => { if (closeOnOverlayClick && event.target === event.currentTarget) controller.close() }
  return <Show when={snapshot().open && step()?.mask !== false && overlay}>{props.children ? props.children({ props: { class: cn(tourOverlayClassName, props.class), style: { 'pointer-events': step()?.disabledInteraction ? 'auto' : 'none', 'z-index': zIndex - 1, ...props.style }, onClick: click }, targetRect: snapshot().targetRect, gap: gap(), color: color() }) : <div class={cn(tourOverlayClassName, props.class)} style={{ 'pointer-events': step()?.disabledInteraction ? 'auto' : 'none', 'z-index': zIndex - 1, ...props.style }} onClick={click}><svg aria-hidden="true" class="size-full" viewBox="0 0 100 100" preserveAspectRatio="none"><mask id="tour-mask"><rect width="100" height="100" fill="white" />{rect() && <rect x={`${rect()!.x / innerWidth * 100}%`} y={`${rect()!.y / innerHeight * 100}%`} width={`${rect()!.width / innerWidth * 100}%`} height={`${rect()!.height / innerHeight * 100}%`} fill="black" />}</mask><rect width="100" height="100" fill={color()} mask="url(#tour-mask)" /></svg></div>}</Show>
}

export function TourArrow(props: { class?: string; style?: JSX.CSSProperties }) {
  const { floating, snapshot } = useTourContentContext('TourArrow')
  onCleanup(() => floating.setArrowElement(null))
  const style = createMemo(() => snapshot().side === 'top' ? { bottom: '-6px', left: 'var(--floating-arrow-x, 50%)', 'border-left': '6px solid transparent', 'border-right': '6px solid transparent', 'border-top': '6px solid var(--background)' } : snapshot().side === 'bottom' ? { top: '-6px', left: 'var(--floating-arrow-x, 50%)', 'border-left': '6px solid transparent', 'border-right': '6px solid transparent', 'border-bottom': '6px solid var(--background)' } : snapshot().side === 'left' ? { right: '-6px', top: 'var(--floating-arrow-y, 50%)', 'border-top': '6px solid transparent', 'border-bottom': '6px solid transparent', 'border-left': '6px solid var(--background)' } : { left: '-6px', top: 'var(--floating-arrow-y, 50%)', 'border-top': '6px solid transparent', 'border-bottom': '6px solid transparent', 'border-right': '6px solid var(--background)' })
  return <div ref={(element) => floating.setArrowElement(element)} data-slot="tour-arrow" data-side={snapshot().side} class={cn(tourArrowClassName, props.class)} style={{ ...style(), ...props.style }} />
}

export function TourControl(props: { action: 'previous' | 'next' | 'skip' | 'close' | 'complete'; class?: string; disabled?: boolean; children?: JSX.Element }) {
  const { controller, snapshot } = useTourContext('TourControl')
  const disabled = () => Boolean(props.disabled || (props.action === 'previous' && snapshot().isFirst))
  function click() { if (disabled()) return; if (props.action === 'previous') void controller.previous(); else if (props.action === 'next') void controller.next(); else if (props.action === 'skip') controller.skip(); else if (props.action === 'close') controller.close(); else controller.complete() }
  return <button type="button" disabled={disabled()} data-tour-action={props.action} class={cn(tourControlClassName, props.class)} onClick={click}>{props.children}</button>
}

export function useTour() {
  const { controller, snapshot } = useTourContext('useTour')
  return { snapshot, open: controller.open, close: controller.close, next: controller.next, previous: controller.previous, goTo: controller.goTo, skip: controller.skip, complete: controller.complete }
}
