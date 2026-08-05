import { createPortal } from 'react-dom'
import { useState, type ComponentProps, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { createContextMenuController } from '@fex-design/core/overlay/context-menu/create-context-menu-controller'
import type { ContextMenuOptions } from '@fex-design/core/overlay/context-menu/types'
import { useLazyRef } from '../../hooks/use-lazy-ref'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import useUnmount from '../../hooks/use-unmount'
import { ContextMenuContext, useContextMenuContext } from './context-menu-context'
import { useContextMenu, useContextMenuContent, useContextMenuTrigger } from './use-context-menu'
export { useContextMenu, useContextMenuContent, useContextMenuTrigger } from './use-context-menu'

export interface ContextMenuRootProps<T> extends Omit<ContextMenuOptions<T>, 'onOpenChange'> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: ContextMenuOptions<T>['onOpenChange']
  children?: ReactNode
}

export function ContextMenuRoot<T>({ children, ...props }: ContextMenuRootProps<T>) {
  const { open, defaultOpen, onOpenChange, ...options } = props
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false)
  const openValue = open ?? uncontrolledOpen
  const controllerRef = useLazyRef(() =>
    createContextMenuController<T>({
      ...options,
      open: openValue,
      onOpenChange: (nextOpen, info) => {
        if (open === undefined) setUncontrolledOpen(nextOpen)
        onOpenChange?.(nextOpen, info)
      },
    }),
  )
  const controller = controllerRef.current
  useIsomorphicLayoutEffect(() => {
    controller.setOptions({
      ...options,
      open: openValue,
      onOpenChange: (nextOpen, info) => {
        if (open === undefined) setUncontrolledOpen(nextOpen)
        onOpenChange?.(nextOpen, info)
      },
    })
  }, [controller, openValue, open, onOpenChange, options])
  useUnmount(() => controller.destroy())
  return <ContextMenuContext value={{ controller }}>{children}</ContextMenuContext>
}

export type ContextMenuTriggerRenderProps<TElement extends HTMLElement = HTMLElement> = Omit<
  HTMLAttributes<TElement>,
  'ref'
> & {
  ref: Ref<TElement>
  'aria-haspopup': 'menu'
  'data-state': 'open' | 'closed'
}

export interface ContextMenuTriggerProps<T, TElement extends HTMLElement = HTMLElement> {
  payload?: T
  children: (props: ContextMenuTriggerRenderProps<TElement>) => ReactNode
}

export function ContextMenuTrigger<T, TElement extends HTMLElement = HTMLElement>({
  payload,
  children,
}: ContextMenuTriggerProps<T, TElement>) {
  const trigger = useContextMenuTrigger<T, TElement>(payload === undefined ? {} : { payload })
  return children(trigger.props)
}

export interface ContextMenuPortalProps {
  children?: ReactNode
  container?: HTMLElement | null
  forceMount?: boolean
}

export function ContextMenuPortal({ children, container, forceMount }: ContextMenuPortalProps) {
  const { overlay, snapshot } = useContextMenu('ContextMenuPortal')
  const popupContainer = container ?? overlay.resolvePopupContainer()
  if (!popupContainer || (!snapshot.overlay.mounted && !forceMount)) return null
  return createPortal(children, popupContainer)
}

export interface ContextMenuContentProps extends ComponentProps<'div'> {
  ref?: Ref<HTMLDivElement>
}

export function ContextMenuContent({ children, ...props }: ContextMenuContentProps) {
  const content = useContextMenuContent(props)
  if (!content.mounted) return null
  return <div {...content.props}>{children}</div>
}

export function ContextMenuItem(props: ComponentProps<'button'>) {
  const { controller } = useContextMenuContext('ContextMenuItem')
  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      role={props.role ?? 'menuitem'}
      onClick={(event) => {
        props.onClick?.(event)
        if (!event.defaultPrevented) controller.overlay.close({ reason: 'manual', source: 'menu-item', event: event.nativeEvent })
      }}
    />
  )
}
