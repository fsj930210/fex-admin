import {
  createContext,
  use,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { createPortal } from 'react-dom'
import {
  createFloatingOverlay,
  type FloatingOverlay,
  type FloatingOverlayOptions,
} from '@fex/components-core/overlay/create-floating-overlay'
import type { OverlayTrigger } from '@fex/components-core/overlay/trigger/create-trigger'
import { cn, shallowEqualObject } from '@fex/utils'
import {
  popoverArrowClassName,
  popoverContentClassName,
  popoverDescriptionClassName,
  popoverHeaderClassName,
  popoverTitleClassName,
} from '@fex/components-styles/popover'
import { useComposedRef } from '../../hooks/use-composed-ref'
import { useCoreStore } from '../../hooks/use-core-store'
import { useLazyRef } from '../../hooks/use-lazy-ref'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
import useUnmount from '../../hooks/use-unmount'

type PopoverContextValue = {
  arrowRef: React.RefObject<HTMLElement | null>
  overlay: FloatingOverlay
  triggerRef: React.RefObject<HTMLElement | null>
  arrow: boolean
}

const PopoverContext = createContext<PopoverContextValue | null>(null)
const popoverAllowedTriggers: OverlayTrigger[] = ['click', 'hover', 'focus', 'context-menu']
const popoverDismiss = { escapeKey: true, outsidePointer: true }
const defaultPopoverTrigger: OverlayTrigger[] = ['click']

function usePopoverContext(component: string) {
  const context = use(PopoverContext)
  if (!context) {
    throw new Error(`${component} must be used inside PopoverRoot`)
  }
  return context
}

export function usePopover(component = 'usePopover') {
  const context = usePopoverContext(component)
  const snapshot = useCoreStore(context.overlay)
  return { ...context, snapshot }
}

function toEventInfo(event: {
  target: EventTarget | null
  currentTarget: EventTarget | null
  clientX?: number
  clientY?: number
  button?: number
  pointerType?: string
  preventDefault: () => void
  stopPropagation: () => void
}) {
  return {
    target: event.target,
    currentTarget: event.currentTarget,
    clientX: event.clientX,
    clientY: event.clientY,
    button: event.button,
    pointerType: event.pointerType,
    event,
    preventDefault: event.preventDefault.bind(event),
    stopPropagation: event.stopPropagation.bind(event),
  }
}

export interface PopoverRootProps extends Omit<FloatingOverlayOptions, 'trigger'> {
  children?: ReactNode
  trigger?: OverlayTrigger[] | undefined
}

export function PopoverRoot({
  children,
  open: openProp,
  defaultOpen,
  onOpenChange,
  trigger = defaultPopoverTrigger,
  allowedTriggers = popoverAllowedTriggers,
  sideOffset = 6,
  arrow,
  closeDelay = 140,
  dismiss = popoverDismiss,
  ...overlayConfig
}: PopoverRootProps) {
  const isControlled = openProp !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false)
  const open = isControlled ? openProp : uncontrolledOpen
  const handleOpenChange = useMemoizedFn<NonNullable<PopoverRootProps['onOpenChange']>>(
    (nextOpen, info) => {
      // React adapter 只在非受控模式写本地 state；受控模式必须等待 open prop 回流。
      // 如果两边都写，会出现 core snapshot 和父组件 open prop 短暂不同步。
      if (!isControlled) {
        setUncontrolledOpen(nextOpen)
      }
      onOpenChange?.(nextOpen, info)
    },
  )
  const overlayOptions: FloatingOverlayOptions = {
    ...overlayConfig,
    open,
    onOpenChange: handleOpenChange,
    trigger,
    allowedTriggers,
    sideOffset,
    closeDelay,
    dismiss,
    arrow,
  }
  const overlayRef = useLazyRef(() => createFloatingOverlay(overlayOptions))
  const triggerRef = useRef<HTMLElement | null>(null)
  const arrowRef = useRef<HTMLElement | null>(null)
  const overlay = overlayRef.current
  const latestOverlayOptionsRef = useRef<FloatingOverlayOptions>(overlayOptions)

  if (!shallowEqualObject(latestOverlayOptionsRef.current, overlayOptions)) {
    // 同步稳定 core controller 的输入，避免每次 render 后再用 effect 补同步。
    latestOverlayOptionsRef.current = overlayOptions
    overlay.setOptions(overlayOptions)
  }

  useUnmount(() => overlay.destroy())

  return (
    <PopoverContext value={{ arrowRef, overlay, triggerRef, arrow: Boolean(arrow) }}>
      {children}
    </PopoverContext>
  )
}

export type PopoverTriggerRenderProps = Omit<ComponentProps<'button'>, 'ref'> & {
  'data-state': 'open' | 'closed'
  ref: Ref<HTMLButtonElement>
}

export interface PopoverTriggerProps extends Omit<ComponentProps<'button'>, 'children'> {
  ref?: Ref<HTMLButtonElement>
  children: (props: PopoverTriggerRenderProps) => ReactNode
}

export type UsePopoverTriggerProps = Omit<PopoverTriggerProps, 'children'>

export function usePopoverTrigger({
  ref,
  onClick,
  onPointerEnter,
  onPointerLeave,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onContextMenu,
  ...props
}: UsePopoverTriggerProps) {
  const { overlay, snapshot, triggerRef } = usePopover('usePopoverTrigger')
  const setReference = useMemoizedFn((element: HTMLButtonElement | null) => {
    // ref 回调是 trigger DOM 进入 core floating 的入口。
    // 不能只依赖点击事件里的 currentTarget，否则 hover/focus 打开时可能还没有 reference。
    triggerRef.current = element
    overlay.setReferenceElement(element)
  })
  const syncReferenceFromEvent = useMemoizedFn(
    (
      event:
        | MouseEvent<HTMLButtonElement>
        | PointerEvent<HTMLButtonElement>
        | FocusEvent<HTMLButtonElement>,
    ) => {
      // 某些渲染分支会替换 button DOM；事件发生时再同步一次 reference，
      // 可以避免 core 仍然拿旧 trigger 计算位置。
      triggerRef.current = event.currentTarget
      overlay.setReferenceElement(event.currentTarget)
    },
  )
  const composedRef = useComposedRef<HTMLButtonElement>(setReference, ref)

  const triggerProps: PopoverTriggerRenderProps = {
    ...props,
    ref: composedRef,
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': snapshot.open,
    'data-state': snapshot.open ? 'open' : 'closed',
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (!event.defaultPrevented && snapshot.trigger.includes('click')) {
        syncReferenceFromEvent(event)
        overlay.trigger.click(toEventInfo(event))
      }
    },
    onPointerEnter: (event: PointerEvent<HTMLButtonElement>) => {
      onPointerEnter?.(event)
      if (!event.defaultPrevented) {
        syncReferenceFromEvent(event)
        overlay.trigger.pointerEnter(toEventInfo(event))
      }
    },
    onPointerLeave: (event: PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(event)
      if (!event.defaultPrevented) {
        syncReferenceFromEvent(event)
        overlay.trigger.pointerLeave(toEventInfo(event))
      }
    },
    onMouseEnter: (event: MouseEvent<HTMLButtonElement>) => {
      onMouseEnter?.(event)
      if (!event.defaultPrevented) {
        syncReferenceFromEvent(event)
        overlay.trigger.pointerEnter(toEventInfo(event))
      }
    },
    onMouseLeave: (event: MouseEvent<HTMLButtonElement>) => {
      onMouseLeave?.(event)
      if (!event.defaultPrevented) {
        syncReferenceFromEvent(event)
        overlay.trigger.pointerLeave(toEventInfo(event))
      }
    },
    onFocus: (event: FocusEvent<HTMLButtonElement>) => {
      onFocus?.(event)
      if (!event.defaultPrevented) {
        syncReferenceFromEvent(event)
        overlay.trigger.focus(toEventInfo(event))
      }
    },
    onBlur: (event: FocusEvent<HTMLButtonElement>) => {
      onBlur?.(event)
      if (!event.defaultPrevented) {
        syncReferenceFromEvent(event)
        overlay.trigger.blur(toEventInfo(event))
      }
    },
    onContextMenu: (event: MouseEvent<HTMLButtonElement>) => {
      onContextMenu?.(event)
      if (!event.defaultPrevented) {
        syncReferenceFromEvent(event)
        overlay.trigger.contextMenu(toEventInfo(event))
      }
    },
  }

  return { props: triggerProps, snapshot }
}

export function PopoverTrigger({ children, ...props }: PopoverTriggerProps) {
  const trigger = usePopoverTrigger(props)
  return children(trigger.props)
}

export interface PopoverPortalProps {
  children?: ReactNode
  container?: HTMLElement | null
  forceMount?: boolean
}

export function PopoverPortal({ children, container, forceMount }: PopoverPortalProps) {
  const { overlay, snapshot } = usePopover('PopoverPortal')
  const popupContainer = container ?? overlay.resolvePopupContainer()

  if (!popupContainer || (!snapshot.mounted && !forceMount)) {
    return null
  }

  return createPortal(children, popupContainer)
}

export interface PopoverContentProps extends ComponentProps<'div'> {
  ref?: Ref<HTMLDivElement>
}

export function usePopoverContent({
  ref,
  className,
  style,
  onPointerEnter,
  onPointerLeave,
  onKeyDown,
  ...props
}: PopoverContentProps) {
  const { overlay, snapshot } = usePopover('usePopoverContent')
  const setContentElement = useMemoizedFn((element: HTMLDivElement | null) => {
    overlay.setFloatingElement(element)
  })
  const composedRef = useComposedRef<HTMLDivElement>(setContentElement, ref)

  if (!snapshot.mounted) {
    return { mounted: false as const, props: null, snapshot }
  }

  return {
    mounted: true as const,
    snapshot,
    props: {
      ...props,
      ref: composedRef,
      role: 'dialog' as const,
      tabIndex: -1,
      'data-slot': 'popover-content',
      'data-state': snapshot.open ? 'open' : 'closed',
      'data-phase': snapshot.phase,
      'data-side': snapshot.side,
      'data-align': snapshot.align,
      'data-placement': snapshot.placement,
      className: cn(popoverContentClassName(), className),
      style:
        {
          // 坐标由 core 写入 CSS 变量。React adapter 不直接读取 x/y，
          // 避免滚动/resize 触发 React 重渲染；DOM 变量更新即可移动浮层。
          position: 'var(--floating-strategy, absolute)',
          left: 'var(--floating-x, 0px)',
          top: 'var(--floating-y, 0px)',
          transformOrigin: 'var(--floating-transform-origin)',
          ...style,
        } as CSSProperties,
      onPointerEnter: (event: PointerEvent<HTMLDivElement>) => {
        onPointerEnter?.(event)
        overlay.content.pointerEnter(toEventInfo(event))
      },
      onPointerLeave: (event: PointerEvent<HTMLDivElement>) => {
        onPointerLeave?.(event)
        overlay.content.pointerLeave(toEventInfo(event))
      },
      onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event)
      },
    },
  }
}

export function PopoverContent({ children, ...props }: PopoverContentProps) {
  const content = usePopoverContent(props)
  if (!content.mounted) {
    return null
  }
  return <div {...content.props}>{children}</div>
}

export interface PopoverArrowProps extends ComponentProps<'div'> {
  ref?: Ref<HTMLDivElement>
}

export function usePopoverArrow({ ref, className, style, ...props }: PopoverArrowProps) {
  const { arrowRef, overlay, arrow, snapshot } = usePopover('usePopoverArrow')
  const setArrowElement = useMemoizedFn((element: HTMLDivElement | null) => {
    arrowRef.current = element
    overlay.setArrowElement(element)
  })
  const composedRef = useComposedRef<HTMLDivElement>(setArrowElement, ref)
  const arrowStyle = useMemo(() => {
    // 箭头方向必须使用 core 计算后的最终 side，而不是 props.placement。
    // 发生 flip 时 props 仍可能是 bottom，但 snapshot.side 已经是 top。
    const floatingArrowStyle =
      snapshot.side === 'left' || snapshot.side === 'right'
        ? {
            top: 'clamp(var(--popover-arrow-inset,32px), var(--floating-arrow-y,50%), calc(100% - var(--popover-arrow-inset,32px)))',
          }
        : {
            left: 'clamp(var(--popover-arrow-inset,32px), var(--floating-arrow-x,50%), calc(100% - var(--popover-arrow-inset,32px)))',
          }
    return {
      ...floatingArrowStyle,
      ...style,
    } as CSSProperties
  }, [snapshot.side, style])

  if (!arrow) {
    return { mounted: false as const, props: null, snapshot }
  }

  return {
    mounted: true as const,
    snapshot,
    props: {
      ...props,
      ref: composedRef,
      'data-slot': 'popover-arrow',
      'data-side': snapshot.side,
      className: cn(popoverArrowClassName, className),
      style: arrowStyle,
    },
  }
}

export function PopoverArrow(props: PopoverArrowProps) {
  const arrow = usePopoverArrow(props)
  if (!arrow.mounted) {
    return null
  }
  return <div {...arrow.props} />
}

export interface PopoverHeaderProps extends ComponentProps<'div'> {
  ref?: Ref<HTMLDivElement>
}

export function PopoverHeader({ ref, className, ...props }: PopoverHeaderProps) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="popover-header"
      className={cn(popoverHeaderClassName, className)}
    />
  )
}

export interface PopoverTitleProps extends ComponentProps<'div'> {
  ref?: Ref<HTMLDivElement>
}

export function PopoverTitle({ ref, className, ...props }: PopoverTitleProps) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="popover-title"
      className={cn(popoverTitleClassName, className)}
    />
  )
}

export interface PopoverDescriptionProps extends ComponentProps<'div'> {
  ref?: Ref<HTMLDivElement>
}

export function PopoverDescription({ ref, className, ...props }: PopoverDescriptionProps) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="popover-description"
      className={cn(popoverDescriptionClassName, className)}
    />
  )
}

export const Popover = Object.assign(PopoverRoot, {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Portal: PopoverPortal,
  Content: PopoverContent,
  Header: PopoverHeader,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Arrow: PopoverArrow,
})
