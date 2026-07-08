import {
  createContext,
  use,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { createPortal } from 'react-dom'
import { createDialogController, type DialogController, type DialogOptions } from '@fex/components-core/dialog/create-dialog-controller'
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
import { cn, shallowEqualObject } from '@fex/utils'
import { useCoreStore } from '../../hooks/use-core-store'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { useLazyRef } from '../../hooks/use-lazy-ref'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
import useUnmount from '../../hooks/use-unmount'

type DialogContextValue = {
  contentId: string
  descriptionId: string
  dialog: DialogController
  titleId: string
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const DialogContext = createContext<DialogContextValue | null>(null)
const defaultDismiss = { escapeKey: true, overlayPointer: true }

function useDialogContext(component: string) {
  const context = use(DialogContext)
  if (!context) {
    throw new Error(`${component} must be used inside DialogRoot`)
  }
  return context
}

export function useDialog(component = 'useDialog') {
  const context = useDialogContext(component)
  const snapshot = useCoreStore(context.dialog)
  return { ...context, snapshot }
}

function toEventInfo(event: { target: EventTarget | null; currentTarget: EventTarget | null; event?: Event }) {
  return {
    target: event.target,
    currentTarget: event.currentTarget,
    event: 'event' in event ? event.event : undefined,
  }
}

export interface DialogRootProps extends DialogOptions {
  children?: ReactNode
}

export function DialogRoot({
  children,
  open: openProp,
  defaultOpen,
  onOpenChange,
  modal = true,
  closeDelay = 140,
  dismiss = defaultDismiss,
  ...options
}: DialogRootProps) {
  const isControlled = openProp !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false)
  const open = isControlled ? openProp : uncontrolledOpen
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const handleOpenChange = useMemoizedFn<NonNullable<DialogOptions['onOpenChange']>>((nextOpen, info) => {
    if (!isControlled) {
      setUncontrolledOpen(nextOpen)
    }
    onOpenChange?.(nextOpen, info)
  })
  const dialogOptions: DialogOptions = { ...options, open, onOpenChange: handleOpenChange, modal, closeDelay, dismiss }
  const dialogRef = useLazyRef(() => createDialogController(dialogOptions))
  const latestOptionsRef = useRef(dialogOptions)
  const dialog = dialogRef.current

  useIsomorphicLayoutEffect(() => {
    if (!shallowEqualObject(latestOptionsRef.current, dialogOptions)) {
      latestOptionsRef.current = dialogOptions
      dialog.setOptions(dialogOptions)
    }
  })

  useUnmount(() => dialog.destroy())

  return (
    <DialogContext
      value={{
        contentId: useId(),
        descriptionId: useId(),
        dialog,
        titleId: useId(),
        triggerRef,
      }}
    >
      {children}
    </DialogContext>
  )
}

export type DialogTriggerRenderProps = Omit<ComponentProps<'button'>, 'children' | 'ref'> & {
  'data-state': 'open' | 'closed'
  ref: Ref<HTMLButtonElement>
}

export interface DialogTriggerProps extends Omit<ComponentProps<'button'>, 'children'> {
  children: (props: DialogTriggerRenderProps) => ReactNode
  ref?: Ref<HTMLButtonElement>
}

export function useDialogTrigger({ ref, onClick, ...props }: Omit<DialogTriggerProps, 'children'>) {
  const { contentId, dialog, snapshot, triggerRef } = useDialog('useDialogTrigger')
  const setTrigger = useMemoizedFn((element: HTMLButtonElement | null) => {
    triggerRef.current = element
    if (typeof ref === 'function') ref(element)
    else if (ref && 'current' in ref) ref.current = element
  })

  return {
    snapshot,
    props: {
      ...props,
      ref: setTrigger,
      type: props.type ?? 'button',
      'aria-haspopup': 'dialog' as const,
      'aria-expanded': snapshot.open,
      'aria-controls': snapshot.open ? contentId : undefined,
      'data-state': snapshot.open ? 'open' as const : 'closed' as const,
      onClick: (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          dialog.toggle({ reason: 'trigger-click', event: event.nativeEvent })
        }
      },
    },
  }
}

export function DialogTrigger({ children, ...props }: DialogTriggerProps) {
  const trigger = useDialogTrigger(props)
  return children(trigger.props)
}

export interface DialogPortalProps {
  children?: ReactNode
  container?: HTMLElement | null
  forceMount?: boolean
}

export function DialogPortal({ children, container, forceMount }: DialogPortalProps) {
  const { snapshot } = useDialog('DialogPortal')
  const portalContainer = container ?? globalThis.document?.body
  if (!portalContainer || (!snapshot.mounted && !forceMount)) {
    return null
  }
  return createPortal(children, portalContainer)
}

export interface DialogOverlayProps extends ComponentProps<'div'> {
  ref?: Ref<HTMLDivElement>
}

export function DialogOverlay({ ref, className, onClick, ...props }: DialogOverlayProps) {
  const { dialog, snapshot } = useDialog('DialogOverlay')
  const setOverlay = useMemoizedFn((element: HTMLDivElement | null) => {
    dialog.setOverlayElement(element)
    if (typeof ref === 'function') ref(element)
    else if (ref && 'current' in ref) ref.current = element
  })
  return (
    <div
      {...props}
      ref={setOverlay}
      data-slot="dialog-overlay"
      data-state={snapshot.open ? 'open' : 'closed'}
      data-phase={snapshot.phase}
      className={cn(dialogOverlayClassName, className)}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented && event.target === event.currentTarget) {
          dialog.dismiss.overlayPointer({ ...toEventInfo(event), event: event.nativeEvent })
        }
      }}
    />
  )
}

export interface DialogContentProps extends ComponentProps<'div'>, DialogStyleProps {
  ref?: Ref<HTMLDivElement>
}

export function DialogContent({ ref, className, size, onKeyDown, ...props }: DialogContentProps) {
  const { contentId, descriptionId, dialog, snapshot, titleId } = useDialog('DialogContent')
  const setContent = useMemoizedFn((element: HTMLDivElement | null) => {
    dialog.setLayerElement(element)
    if (typeof ref === 'function') ref(element)
    else if (ref && 'current' in ref) ref.current = element
  })

  if (!snapshot.mounted) {
    return null
  }

  return (
    <div
      {...props}
      ref={setContent}
      id={contentId}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      tabIndex={-1}
      data-slot="dialog-content"
      data-state={snapshot.open ? 'open' : 'closed'}
      data-phase={snapshot.phase}
      className={cn(dialogContentClassName({ size }), className)}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event)
        if (!event.defaultPrevented && event.key === 'Escape') {
          dialog.dismiss.escapeKey({ ...toEventInfo(event), event: event.nativeEvent })
        }
      }}
    />
  )
}

export function DialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} data-slot="dialog-header" className={cn(dialogHeaderClassName, className)} />
}

export function DialogTitle({ className, ...props }: ComponentProps<'h2'>) {
  const { titleId } = useDialog('DialogTitle')
  return <h2 {...props} id={titleId} data-slot="dialog-title" className={cn(dialogTitleClassName, className)} />
}

export function DialogDescription({ className, ...props }: ComponentProps<'p'>) {
  const { descriptionId } = useDialog('DialogDescription')
  return <p {...props} id={descriptionId} data-slot="dialog-description" className={cn(dialogDescriptionClassName, className)} />
}

export function DialogBody({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} data-slot="dialog-body" className={cn(dialogBodyClassName, className)} />
}

export function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} data-slot="dialog-footer" className={cn(dialogFooterClassName, className)} />
}

export type DialogCloseRenderProps = Omit<ComponentProps<'button'>, 'children' | 'ref'> & {
  ref?: Ref<HTMLButtonElement>
}

export interface DialogCloseProps extends Omit<ComponentProps<'button'>, 'children'> {
  children?: ((props: DialogCloseRenderProps) => ReactNode) | ReactNode
  ref?: Ref<HTMLButtonElement>
}

export function DialogClose({ children, className, onClick, type = 'button', ...props }: DialogCloseProps) {
  const { dialog } = useDialog('DialogClose')
  const closeProps = {
    ...props,
    type,
    'data-slot': 'dialog-close',
    className: cn(dialogCloseClassName, className),
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (!event.defaultPrevented) {
        dialog.close({ reason: 'manual', source: 'close-button', event: event.nativeEvent })
      }
    },
  }

  return typeof children === 'function' ? children(closeProps) : <button {...closeProps}>{children ?? 'Close'}</button>
}

export const Dialog = Object.assign(DialogRoot, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
  Close: DialogClose,
})

export {
  DialogRoot as Root,
  DialogTrigger as Trigger,
  DialogPortal as Portal,
  DialogOverlay as Overlay,
  DialogContent as Content,
  DialogHeader as Header,
  DialogTitle as Title,
  DialogDescription as Description,
  DialogBody as Body,
  DialogFooter as Footer,
  DialogClose as Close,
}
