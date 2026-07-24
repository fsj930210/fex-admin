import {
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
  type Ref,
} from 'react'
import { createPortal } from 'react-dom'
import {
  createFloatingOverlay,
  type FloatingOverlayOptions,
} from '@fex/components-core/overlay/create-floating-overlay'
import type { OverlayTrigger } from '@fex/components-core/overlay/trigger/create-trigger'
import { cn, shallowEqualObject } from '@fex/utils'
import {
  popoverDescriptionClassName,
  popoverHeaderClassName,
  popoverTitleClassName,
} from '@fex/components-styles/popover'
import { useLazyRef } from '../../hooks/use-lazy-ref'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
import useUnmount from '../../hooks/use-unmount'
import { PopoverContext } from './popover-context'
import { usePopover, usePopoverArrow, usePopoverContent, usePopoverTrigger } from './use-popover'

const popoverAllowedTriggers: OverlayTrigger[] = ['click', 'hover', 'focus', 'context-menu']
const popoverDismiss = { escapeKey: true, outsidePointer: true }
const defaultPopoverTrigger: OverlayTrigger[] = ['click']

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

  useIsomorphicLayoutEffect(() => {
    if (shallowEqualObject(latestOverlayOptionsRef.current, overlayOptions)) return
    // Overlay 是 React 外部系统；提交 DOM 后再同步，避免 render 阶段通知已挂载的订阅者。
    latestOverlayOptionsRef.current = overlayOptions
    overlay.setOptions(overlayOptions)
  })

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
  ref?: Ref<HTMLDivElement> | undefined
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

