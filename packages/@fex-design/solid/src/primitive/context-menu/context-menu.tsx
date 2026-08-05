import { createContextMenuController } from '@fex-design/core/overlay/context-menu/create-context-menu-controller'
import type {
  ContextMenuController,
  ContextMenuOptions,
} from '@fex-design/core/overlay/context-menu/types'
import { popoverContentClassName, popoverMenuContentClassName } from '@fex-design/styles/popover'
import { cn } from '@fex/utils'
import { Portal } from 'solid-js/web'
import { createEffect, createSignal, onCleanup, Show, splitProps, type JSX, type ParentProps } from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'
import { ContextMenuContext, useContextMenuContext } from './context-menu-context'

function eventInfo(event: Event & Partial<PointerEvent>) {
  return { target: event.target, currentTarget: event.currentTarget, clientX: event.clientX, clientY: event.clientY, button: event.button, pointerType: event.pointerType, event, preventDefault: event.preventDefault.bind(event), stopPropagation: event.stopPropagation.bind(event) }
}

export interface ContextMenuProps<T = unknown> extends Omit<ParentProps, 'children'>, Omit<ContextMenuOptions<T>, 'onOpenChange'> {
  children: JSX.Element | (() => JSX.Element)
  onOpenChange?: ContextMenuOptions<T>['onOpenChange']
}

function ContextMenuChildren(props: { children: JSX.Element | (() => JSX.Element) }) {
  return typeof props.children === 'function' ? props.children() : props.children
}

export function ContextMenu(props: ContextMenuProps<any>) {
  const [local] = splitProps(props, ['children', 'open', 'defaultOpen', 'onOpenChange', 'side', 'align', 'sideOffset'])
  const [open, setOpen] = createSignal(local.open ?? local.defaultOpen ?? false)
  const controller = createContextMenuController<any>({
    ...props,
    open: open(),
    side: local.side ?? 'right',
    align: local.align ?? 'start',
    sideOffset: local.sideOffset ?? 2,
    onOpenChange(nextOpen, info) {
      if (local.open === undefined) setOpen(nextOpen)
      local.onOpenChange?.(nextOpen, info)
    },
  })
  createEffect(() => controller.setOptions({
    ...props,
    open: local.open ?? open(),
    side: local.side ?? 'right',
    align: local.align ?? 'start',
    sideOffset: local.sideOffset ?? 2,
    onOpenChange(nextOpen, info) {
      if (local.open === undefined) setOpen(nextOpen)
      local.onOpenChange?.(nextOpen, info)
    },
  }))
  const snapshot = createCoreStoreSignal(controller)
  onCleanup(() => controller.destroy())
  return (
    <ContextMenuContext.Provider value={{ controller, snapshot }}>
      <ContextMenuChildren children={props.children} />
    </ContextMenuContext.Provider>
  )
}

export interface ContextMenuTriggerProps<T = unknown> {
  payload?: T
  children: (args: { ref: (element: HTMLElement) => void; props: JSX.HTMLAttributes<HTMLElement>; state: ReturnType<ContextMenuController<T>['getSnapshot']> }) => JSX.Element
}

export function ContextMenuTrigger(props: ContextMenuTriggerProps<any>) {
  const context = useContextMenuContext<any>('ContextMenuTrigger')
  function ref(element: HTMLElement) { context.controller.overlay.setReferenceElement(element) }
  onCleanup(() => context.controller.overlay.setReferenceElement(null))
  return props.children({
    ref,
    state: context.snapshot(),
    props: {
      'aria-haspopup': 'menu',
      ['data-state' as string]: context.snapshot().overlay.open ? 'open' : 'closed',
      onContextMenu: (event) => {
        const current = event.currentTarget as HTMLElement
        context.controller.openAt({ payload: props.payload, element: current, clientX: event.clientX, clientY: event.clientY, event }, eventInfo(event))
      },
      onKeyDown: (event) => {
        if ((event.shiftKey && event.key === 'F10') || event.key === 'ContextMenu') {
          event.preventDefault()
          const current = event.currentTarget as HTMLElement
          const rect = current.getBoundingClientRect()
          context.controller.openAt({ payload: props.payload, element: current, clientX: rect.left, clientY: rect.bottom, event }, eventInfo(event))
        }
      },
    },
  })
}

export function ContextMenuPortal(props: ParentProps<{ container?: HTMLElement | null }>) {
  const context = useContextMenuContext('ContextMenuPortal')
  return <Show when={context.snapshot().overlay.mounted}><Portal mount={props.container ?? context.controller.overlay.resolvePopupContainer() ?? document.body}>{props.children}</Portal></Show>
}

export interface ContextMenuContentProps extends ParentProps { class?: string; role?: JSX.HTMLAttributes<HTMLDivElement>['role']; style?: string }
export function ContextMenuContent(props: ContextMenuContentProps) {
  const context = useContextMenuContext('ContextMenuContent')
  function ref(element: HTMLDivElement) { queueMicrotask(() => context.controller.overlay.setFloatingElement(element)) }
  onCleanup(() => context.controller.overlay.setFloatingElement(null))
  return <Show when={context.snapshot().overlay.mounted}><div ref={ref} role={props.role ?? 'menu'} tabIndex={-1} data-slot="context-menu-content" data-state={context.snapshot().overlay.open ? 'open' : 'closed'} data-phase={context.snapshot().overlay.phase} data-side={context.snapshot().overlay.side} data-align={context.snapshot().overlay.align} class={cn(popoverContentClassName(), popoverMenuContentClassName, props.class)} style={`position:var(--floating-strategy, absolute);left:var(--floating-x,0px);top:var(--floating-y,0px);${props.style ?? ''}`}>{props.children}</div></Show>
}

export function ContextMenuItem(props: ParentProps<JSX.ButtonHTMLAttributes<HTMLButtonElement>>) {
  const context = useContextMenuContext('ContextMenuItem')
  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      role={props.role ?? 'menuitem'}
      onClick={(event) => {
        const click = props.onClick
        if (typeof click === 'function') click(event)
        if (!event.defaultPrevented) {
          context.controller.overlay.close({ reason: 'manual', source: 'menu-item', event })
        }
      }}
    >
      {props.children}
    </button>
  )
}

export { useContextMenuContext }
