import { createDialogController, type DialogOptions } from '@fex/components-core/dialog/create-dialog-controller'
import {
  dialogBodyClassName,
  dialogCloseClassName,
  dialogContentClassName,
  dialogDescriptionClassName,
  dialogFooterClassName,
  dialogHeaderClassName,
  dialogOverlayClassName,
  dialogTitleClassName,
  type DialogStyleProps,
} from '@fex/components-styles/dialog'
import { cn } from '@fex/utils'
import { Portal } from 'solid-js/web'
import {
  createSignal,
  onCleanup,
  Show,
  splitProps,
  type JSX,
  type ParentProps,
} from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'
import { DialogContext, useDialog } from './dialog-context'
let nextDialogId = 1

export interface DialogProps extends ParentProps, DialogOptions {}

export function Dialog(props: DialogProps) {
  const [local] = splitProps(props, ['children', 'open', 'defaultOpen', 'onOpenChange', 'modal', 'forceMount', 'closeDelay', 'dismiss', 'closeOnOverlayPointer'])
  const [open, setOpen] = createSignal(local.open ?? local.defaultOpen ?? false)
  const triggerElement = { current: null as HTMLButtonElement | null }
  const dialogId = nextDialogId++

  function makeOptions(openValue: boolean): DialogOptions {
    return {
      open: openValue,
      modal: local.modal ?? true,
      forceMount: local.forceMount,
      closeDelay: local.closeDelay ?? 140,
      dismiss: local.dismiss,
      closeOnOverlayPointer: local.closeOnOverlayPointer,
      onOpenChange(nextOpen, info) {
        if (local.open === undefined) {
          setOpen(nextOpen)
          dialog.setOptions(makeOptions(nextOpen))
        }
        local.onOpenChange?.(nextOpen, info)
      },
    }
  }

  function syncOptions() {
    dialog.setOptions(makeOptions(local.open ?? open()))
    return null
  }

  const dialog = createDialogController(makeOptions(open()))
  const snapshot = createCoreStoreSignal(dialog)

  onCleanup(() => dialog.destroy())

  return (
    <>
      {syncOptions()}
      <DialogContext.Provider
        value={{
          contentId: `fex-dialog-content-${dialogId}`,
          descriptionId: `fex-dialog-description-${dialogId}`,
          dialog,
          snapshot,
          titleId: `fex-dialog-title-${dialogId}`,
          triggerElement,
        }}
      >
        {local.children}
      </DialogContext.Provider>
    </>
  )
}

export type DialogTriggerRenderProps = {
  props: {
    'aria-controls': string | undefined
    'aria-expanded': boolean
    'aria-haspopup': 'dialog'
    'data-state': 'open' | 'closed'
    class: string | undefined
    onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
    type: 'button'
  }
  ref: (element: HTMLButtonElement) => void
  state: ReturnType<ReturnType<typeof createDialogController>['getSnapshot']>
}

export interface DialogTriggerProps {
  children: (props: DialogTriggerRenderProps) => JSX.Element
  class?: string
}

export function DialogTrigger(props: DialogTriggerProps) {
  const [local] = splitProps(props, ['children', 'class'])
  const { contentId, dialog, snapshot, triggerElement } = useDialog('DialogTrigger')

  return local.children({
    ref: (element) => {
      triggerElement.current = element
    },
    state: snapshot(),
    props: {
      type: 'button',
      class: local.class,
      'aria-haspopup': 'dialog',
      'aria-expanded': snapshot().open,
      'aria-controls': snapshot().open ? contentId : undefined,
      'data-state': snapshot().open ? 'open' : 'closed',
      onClick: (event) => dialog.toggle({ reason: 'trigger-click', event }),
    },
  })
}

export interface DialogPortalProps extends ParentProps {
  container?: HTMLElement | null
  forceMount?: boolean
}

export function DialogPortal(props: DialogPortalProps) {
  const { snapshot } = useDialog('DialogPortal')
  return (
    <Show when={snapshot().mounted || props.forceMount}>
      <Portal mount={props.container ?? document.body}>{props.children}</Portal>
    </Show>
  )
}

export interface DialogOverlayProps {
  class?: string
}

export function DialogOverlay(props: DialogOverlayProps) {
  const [local] = splitProps(props, ['class'])
  const { dialog, snapshot } = useDialog('DialogOverlay')
  onCleanup(() => dialog.setOverlayElement(null))
  return (
    <div
      ref={(element) => dialog.setOverlayElement(element)}
      data-slot="dialog-overlay"
      data-state={snapshot().open ? 'open' : 'closed'}
      data-phase={snapshot().phase}
      class={cn(dialogOverlayClassName, local.class)}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          dialog.dismiss.overlayPointer({ target: event.target, currentTarget: event.currentTarget, event })
        }
      }}
    />
  )
}

export interface DialogContentProps extends ParentProps {
  class?: string
  size?: DialogStyleProps['size']
}

export function DialogContent(props: DialogContentProps) {
  const [local] = splitProps(props, ['children', 'class', 'size'])
  const { contentId, descriptionId, dialog, snapshot, titleId } = useDialog('DialogContent')
  onCleanup(() => dialog.setLayerElement(null))
  return (
    <Show when={snapshot().mounted}>
      <div
        ref={(element) => dialog.setLayerElement(element)}
        id={contentId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        data-slot="dialog-content"
        data-state={snapshot().open ? 'open' : 'closed'}
        data-phase={snapshot().phase}
        class={cn(dialogContentClassName({ size: local.size }), local.class)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            dialog.dismiss.escapeKey({ target: event.target, currentTarget: event.currentTarget, event })
          }
        }}
      >
        {local.children}
      </div>
    </Show>
  )
}

function createPart(slot: string, className: string) {
  return function DialogPart(props: ParentProps<{ class?: string }>) {
    const [local, rest] = splitProps(props, ['children', 'class'])
    return <div {...rest} data-slot={slot} class={cn(className, local.class)}>{local.children}</div>
  }
}

export const DialogHeader = createPart('dialog-header', dialogHeaderClassName)
export const DialogBody = createPart('dialog-body', dialogBodyClassName)
export const DialogFooter = createPart('dialog-footer', dialogFooterClassName)

export function DialogTitle(props: ParentProps<{ class?: string }>) {
  const [local, rest] = splitProps(props, ['children', 'class'])
  const { titleId } = useDialog('DialogTitle')
  return <h2 {...rest} id={titleId} data-slot="dialog-title" class={cn(dialogTitleClassName, local.class)}>{local.children}</h2>
}

export function DialogDescription(props: ParentProps<{ class?: string }>) {
  const [local, rest] = splitProps(props, ['children', 'class'])
  const { descriptionId } = useDialog('DialogDescription')
  return <p {...rest} id={descriptionId} data-slot="dialog-description" class={cn(dialogDescriptionClassName, local.class)}>{local.children}</p>
}

export type DialogCloseRenderProps = {
  class: string
  onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
  type: 'button'
  'data-slot': 'dialog-close'
}

export interface DialogCloseProps {
  children?: JSX.Element | ((props: DialogCloseRenderProps) => JSX.Element)
  class?: string
}

export function DialogClose(props: DialogCloseProps) {
  const [local, rest] = splitProps(props, ['children', 'class'])
  const { dialog } = useDialog('DialogClose')
  const closeProps = {
    ...rest,
    type: 'button' as const,
    'data-slot': 'dialog-close' as const,
    class: cn(dialogCloseClassName, local.class),
    onClick: (event: MouseEvent) => dialog.close({ reason: 'manual', source: 'close-button', event }),
  }

  return typeof local.children === 'function'
    ? local.children(closeProps)
    : <button {...closeProps}>{local.children ?? 'Close'}</button>
}
