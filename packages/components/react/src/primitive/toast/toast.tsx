import {
  toastActionClassName,
  toastCloseClassName,
  toastDescriptionClassName,
  toastIconClassName,
  toastRootClassName,
  toastStackContainerClassName,
  toastStackItemsClassName,
  toastStackLayerClassName,
  toastTitleClassName,
  toastViewportClassName,
  type ToastPlacement,
  type ToastStyleProps,
} from '@fex/components-styles/toast'
import { cn } from '@fex/utils'
import { createPortal } from 'react-dom'
import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import { useToasts } from '../../hooks/use-toasts'
import { toast, type ReactToastItem, type ReactToastManager } from './toast-manager'

export { createToastManager, toast } from './toast-manager'
export type { ReactToastItem, ReactToastManager } from './toast-manager'

export interface ToastViewportProps extends Omit<ComponentProps<'div'>, 'children'> {
  children: (items: ReactToastItem[]) => ReactNode
  container?: Element | DocumentFragment | null
  manager?: ReactToastManager
  offset?: number | string
  placement?: ToastPlacement
  stack?: boolean
  stackThreshold?: number
}

export function ToastViewport({
  children,
  className,
  container,
  manager = toast,
  offset = 24,
  placement,
  stack = false,
  stackThreshold = 3,
  style,
  ...props
}: ToastViewportProps) {
  const { items } = useToasts(manager)
  const placements = placement ? [placement] : toastPlacements

  const content = (
    <>
      {placements.map((currentPlacement) => {
        const placementItems = items.filter((item) => item.placement === currentPlacement)
        const stacked = stack && placementItems.length > stackThreshold
        const renderedItems = stacked ? placementItems.slice(-1) : placementItems
        if (placementItems.length === 0) return null

        return (
          <div
            key={currentPlacement}
            data-slot="toast-viewport"
            className={cn(toastViewportClassName({ placement: currentPlacement }), className)}
            style={{ '--toast-offset': typeof offset === 'number' ? `${offset}px` : offset, ...style } as CSSProperties}
            {...props}
          >
            <div className={toastStackContainerClassName({ placement: currentPlacement })}>
              {stacked ? (
                <>
                  <div aria-hidden="true" className={cn(toastStackLayerClassName, 'top-2 opacity-70')} />
                  <div aria-hidden="true" className={cn(toastStackLayerClassName, 'top-4 w-[calc(100%-32px)] opacity-40')} />
                </>
              ) : null}
              <div className={toastStackItemsClassName({ placement: currentPlacement })}>
                {children(renderedItems)}
              </div>
            </div>
          </div>
        )
      })}
    </>
  )

  const portalContainer = container ?? globalThis.document?.body
  return portalContainer ? createPortal(content, portalContainer) : content
}

export interface ToastRootProps extends ComponentProps<'div'> {
  manager?: ReactToastManager
  toast: ReactToastItem
}

export function ToastRoot({ children, className, manager = toast, toast: item, ...props }: ToastRootProps) {
  const knownVariant = isKnownVariant(item.variant) ? item.variant : 'default'

  return (
    <div
      {...props}
      data-paused={item.paused ? '' : undefined}
      data-slot="toast"
      data-variant={item.variant}
      role="status"
      className={cn(toastRootClassName({ variant: knownVariant }), className)}
      onPointerEnter={(event) => {
        props.onPointerEnter?.(event)
        manager.pause(item.id)
      }}
      onPointerLeave={(event) => {
        props.onPointerLeave?.(event)
        manager.resume(item.id)
      }}
    >
      {children}
    </div>
  )
}

export function ToastIcon({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="toast-icon" className={cn(toastIconClassName, className)} {...props} />
}

export function ToastTitle({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="toast-title" className={cn(toastTitleClassName, className)} {...props} />
}

export function ToastDescription({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="toast-description" className={cn(toastDescriptionClassName, className)} {...props} />
}

export function ToastAction({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="toast-action" className={cn(toastActionClassName, className)} {...props} />
}

export interface ToastCloseProps extends ComponentProps<'button'> {
  manager?: ReactToastManager
  toast: ReactToastItem
}

export function ToastClose({ className, manager = toast, toast: item, ...props }: ToastCloseProps) {
  return (
    <button
      {...props}
      type="button"
      aria-label="Close toast"
      data-slot="toast-close"
      className={cn(toastCloseClassName, className)}
      onClick={(event) => {
        props.onClick?.(event)
        manager.dismiss(item.id)
      }}
    />
  )
}

function isKnownVariant(variant: ReactToastItem['variant']): variant is NonNullable<ToastStyleProps['variant']> {
  return variant === 'default' || variant === 'success' || variant === 'info' || variant === 'warning' || variant === 'error' || variant === 'loading'
}

const toastPlacements: ToastPlacement[] = ['top-left', 'top', 'top-right', 'bottom-left', 'bottom', 'bottom-right']
