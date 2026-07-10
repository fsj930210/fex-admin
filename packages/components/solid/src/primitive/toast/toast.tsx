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
import { For, Show, type JSX } from 'solid-js'
import { Portal } from 'solid-js/web'
import { createToasts } from '../../primitives/create-toasts'
import { toast, type SolidToastItem, type SolidToastManager } from './toast-manager'

export { createToastManager, toast } from './toast-manager'
export type { SolidToastContent, SolidToastItem, SolidToastManager } from './toast-manager'

export interface ToastViewportProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: (items: SolidToastItem[]) => JSX.Element
  manager?: SolidToastManager
  offset?: number | string
  placement?: ToastPlacement
  portal?: boolean
  stack?: boolean
  stackThreshold?: number
}

export function ToastViewport(props: ToastViewportProps) {
  const manager = () => props.manager ?? toast
  const { items: toastItems } = createToasts(manager())

  const content = () => (
    <For each={props.placement ? [props.placement] : toastPlacements}>
      {(placement) => {
        const items = () => toastItems().filter((item) => item.placement === placement)
        const stacked = () => props.stack === true && items().length > (props.stackThreshold ?? 3)
        const renderedItems = () => stacked() ? items().slice(-1) : items()
        return (
          <Show when={items().length > 0}>
            <div
              data-slot="toast-viewport"
              class={cn(toastViewportClassName({ placement }), props.class)}
              style={{ '--toast-offset': typeof props.offset === 'number' ? `${props.offset}px` : (props.offset ?? '24px'), ...styleObject(props.style) }}
            >
              <div class={toastStackContainerClassName({ placement })}>
                <Show when={stacked()}>
                  <div aria-hidden="true" class={cn(toastStackLayerClassName, 'top-2 opacity-70')} />
                  <div aria-hidden="true" class={cn(toastStackLayerClassName, 'top-4 w-[calc(100%-32px)] opacity-40')} />
                </Show>
                <div class={toastStackItemsClassName({ placement })}>{props.children(renderedItems())}</div>
              </div>
            </div>
          </Show>
        )
      }}
    </For>
  )

  return props.portal === false ? content() : <Portal>{content()}</Portal>
}

export interface ToastRootProps extends JSX.HTMLAttributes<HTMLDivElement> {
  manager?: SolidToastManager
  toast: SolidToastItem
}

export function ToastRoot(props: ToastRootProps) {
  const manager = () => props.manager ?? toast
  const knownVariant = () => isKnownVariant(props.toast.variant) ? props.toast.variant : 'default'

  return (
    <div
      data-paused={props.toast.paused ? '' : undefined}
      data-slot="toast"
        data-variant={props.toast.variant}
        role="status"
      class={cn(toastRootClassName({
        variant: knownVariant(),
      }), props.class)}
      onPointerEnter={() => {
        manager().pause(props.toast.id)
      }}
      onPointerLeave={() => {
        manager().resume(props.toast.id)
      }}
    >
      {props.children}
    </div>
  )
}

const toastPlacements: ToastPlacement[] = ['top-left', 'top', 'top-right', 'bottom-left', 'bottom', 'bottom-right']

export function ToastIcon(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} data-slot="toast-icon" class={cn(toastIconClassName, props.class)} />
}

export function ToastTitle(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} data-slot="toast-title" class={cn(toastTitleClassName, props.class)} />
}

export function ToastDescription(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} data-slot="toast-description" class={cn(toastDescriptionClassName, props.class)} />
}

export function ToastAction(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} data-slot="toast-action" class={cn(toastActionClassName, props.class)} />
}

export function ToastClose(props: JSX.ButtonHTMLAttributes<HTMLButtonElement> & { manager?: SolidToastManager, toast: SolidToastItem }) {
  const manager = () => props.manager ?? toast
  return (
    <button
      {...props}
      type="button"
      aria-label="Close toast"
      data-slot="toast-close"
      class={cn(toastCloseClassName, props.class)}
      onClick={() => {
        manager().dismiss(props.toast.id)
      }}
    />
  )
}

function isKnownVariant(variant: SolidToastItem['variant']): variant is NonNullable<ToastStyleProps['variant']> {
  return variant === 'default' || variant === 'success' || variant === 'info' || variant === 'warning' || variant === 'error' || variant === 'loading'
}

function styleObject(style: JSX.CSSProperties | string | undefined) {
  return typeof style === 'object' ? style : {}
}
