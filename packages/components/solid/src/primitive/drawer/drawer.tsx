import { createDrawerController, type DrawerOptions, type DrawerPlacement, type DrawerSize } from '@fex/components-core/drawer/create-drawer-controller'
import { drawerBodyClassName, drawerCloseClassName, drawerContentClassName, drawerFooterClassName, drawerHeaderClassName, drawerMaskClassName, drawerResizeHandleClassName } from '@fex/components-styles/drawer'
import { cn } from '@fex/utils'
import { createSignal, onCleanup, Show, splitProps, useContext, type JSX, type ParentProps } from 'solid-js'
import { Portal } from 'solid-js/web'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'
import { createResize } from '../../primitives/create-resize'
import { CloseIcon } from '../../icon/close'
import { DrawerContext, useDrawer } from './drawer-context'

export interface DrawerProps extends ParentProps, DrawerOptions { size?: DrawerSize; defaultSize?: DrawerSize; resizable?: boolean; minSize?: number; maxSize?: number; onSizeChange?: (size: number) => void }
export function Drawer(props: DrawerProps) {
  const parent = useContext(DrawerContext)
  const depth = (parent?.depth ?? -1) + 1
  const [local] = splitProps(props, [
    'children',
    'open',
    'defaultOpen',
    'onOpenChange',
    'placement',
    'mask',
    'modal',
    'dismiss',
    'closeOnMaskPointer',
    'forceMount',
    'closeDelay',
    'size',
    'defaultSize',
    'resizable',
    'minSize',
    'maxSize',
    'onSizeChange',
  ])
  const [open, setOpen] = createSignal(local.open ?? local.defaultOpen ?? false)
  const placement = () => local.placement ?? 'right'
  const mask = () => local.mask ?? true
  const triggerElement = { current: null as HTMLButtonElement | null }

  function makeOptions(openValue: boolean): DrawerOptions {
    return {
      open: openValue,
      placement: placement(),
      mask: mask(),
      modal: local.modal,
      dismiss: local.dismiss,
      closeOnMaskPointer: local.closeOnMaskPointer,
      forceMount: local.forceMount,
      closeDelay: local.closeDelay ?? 300,
      onOpenChange(nextOpen, info) {
        if (local.open === undefined) {
          setOpen(nextOpen)
          drawer.setOptions(makeOptions(nextOpen))
        }
        local.onOpenChange?.(nextOpen, info)
      },
    }
  }

  const drawer = createDrawerController(makeOptions(open()))
  const snapshot = createCoreStoreSignal(drawer)

  function syncOptions() {
    drawer.setOptions(makeOptions(local.open ?? open()))
    return null
  }

  onCleanup(() => drawer.destroy())

  return (
    <>
      {syncOptions()}
      <DrawerContext.Provider value={{ drawer, snapshot, placement, mask, depth, triggerElement, resizeOptions: { size: () => local.size ?? local.defaultSize, resizable: () => local.resizable ?? false, minSize: () => local.minSize, maxSize: () => local.maxSize, onSizeChange: () => local.onSizeChange } }}>
        {local.children}
      </DrawerContext.Provider>
    </>
  )
}
export function DrawerTrigger(props: { children: (slot: { props: any; ref: (el: HTMLButtonElement) => void; state: ReturnType<ReturnType<typeof createDrawerController>['getSnapshot']> }) => JSX.Element }) { const { drawer, snapshot, triggerElement } = useDrawer('DrawerTrigger'); return props.children({ ref: (el) => { triggerElement.current = el }, state: snapshot(), props: { type: 'button', 'data-state': snapshot().open ? 'open' : 'closed', 'aria-haspopup': 'dialog', 'aria-expanded': snapshot().open, onClick: (e: MouseEvent) => drawer.toggle({ source: 'trigger', event: e }) } }) }
export function DrawerPortal(props: ParentProps & { forceMount?: boolean }) { const { snapshot, depth } = useDrawer('DrawerPortal'); return <Show when={snapshot().mounted || props.forceMount}><Portal><div style={{ display: 'contents', '--drawer-z-index': 50 + depth * 2 }}>{props.children}</div></Portal></Show> }
export function DrawerMask(props: JSX.HTMLAttributes<HTMLDivElement>) { const { drawer, snapshot, mask } = useDrawer('DrawerMask'); onCleanup(() => drawer.setOverlayElement(null)); return <Show when={mask()}><div {...props} ref={(element) => drawer.setOverlayElement(element)} data-slot="drawer-mask" data-state={snapshot().open ? 'open' : 'closed'} data-phase={snapshot().phase} class={cn(drawerMaskClassName, props.class)} onClick={(e) => { (props.onClick as any)?.(e); if (e.target === e.currentTarget) drawer.dismiss.overlayPointer({ target: e.target, currentTarget: e.currentTarget, event: e }) }} /></Show> }
export function DrawerContent(props: ParentProps & JSX.HTMLAttributes<HTMLDivElement> & { size?: DrawerSize; placement?: DrawerPlacement }) { const context = useDrawer('DrawerContent'); const { drawer, snapshot, placement, resizeOptions } = context; const currentPlacement = () => props.placement ?? placement(); const configuredSize = () => props.size ?? resizeOptions.size() ?? 'md'; const numericSize = () => typeof configuredSize() === 'number' ? configuredSize() as number : Number.parseInt(({ sm:'320', md:'400', lg:'560', xl:'720', full:'100' } as Record<string,string>)[String(configuredSize())] ?? String(configuredSize()), 10) || 400; const edge = () => ({ left:'right', right:'left', top:'bottom', bottom:'top' }[currentPlacement()] as any); const resize = createResize({ defaultRect: { x: 0, y: 0, width: currentPlacement() === 'left' || currentPlacement() === 'right' ? numericSize() : 0, height: currentPlacement() === 'top' || currentPlacement() === 'bottom' ? numericSize() : 0 }, edges: [edge()], disabled: !resizeOptions.resizable(), ...(currentPlacement() === 'left' || currentPlacement() === 'right' ? { minWidth: resizeOptions.minSize(), maxWidth: resizeOptions.maxSize() } : { minHeight: resizeOptions.minSize(), maxHeight: resizeOptions.maxSize() }), onResize: (rect) => resizeOptions.onSizeChange()?.(currentPlacement() === 'left' || currentPlacement() === 'right' ? rect.width : rect.height) }); context.resize = resize; const size = () => typeof configuredSize() === 'number' ? `${configuredSize()}px` : ({ sm:'320px', md:'400px', lg:'560px', xl:'720px', full:'100%' } as Record<string,string>)[String(configuredSize())] ?? String(configuredSize()); onCleanup(() => { drawer.setLayerElement(null); resize.setTarget(null); if (context.resize === resize) context.resize = undefined }); return <Show when={snapshot().mounted}><div {...props} ref={(el) => { drawer.setLayerElement(el); resize.setTarget(el) }} role="dialog" tabindex="-1" data-slot="drawer-content" data-placement={currentPlacement()} data-state={snapshot().open ? 'open' : 'closed'} data-phase={snapshot().phase} style={{ '--drawer-size': size() }} class={cn(drawerContentClassName({ placement: currentPlacement() }), props.class)} onKeyDown={(e) => { (props.onKeyDown as any)?.(e); if (e.key === 'Escape') drawer.dismiss.escapeKey({ target: e.target, currentTarget: e.currentTarget, event: e }) }}>{props.children}</div></Show> }
export function DrawerResizeHandle(props: JSX.HTMLAttributes<HTMLDivElement>) { const context = useDrawer('DrawerResizeHandle'); const edge = () => ({ left:'right', right:'left', top:'bottom', bottom:'top' }[context.placement()] as any); return <Show when={context.resize}>{(resize) => <div {...props} {...resize().getHandleProps(edge())} data-slot="drawer-resize-handle" data-edge={edge()} class={cn(drawerResizeHandleClassName, props.class)} />}</Show> }
export function DrawerHeader(props: JSX.HTMLAttributes<HTMLDivElement>) { return <div {...props} data-slot="drawer-header" class={cn(drawerHeaderClassName, props.class)} /> }
export function DrawerBody(props: JSX.HTMLAttributes<HTMLDivElement>) { return <div {...props} data-slot="drawer-body" class={cn(drawerBodyClassName, props.class)} /> }
export function DrawerFooter(props: JSX.HTMLAttributes<HTMLDivElement>) { return <div {...props} data-slot="drawer-footer" class={cn(drawerFooterClassName, props.class)} /> }
export function DrawerClose(props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) { const { drawer } = useDrawer('DrawerClose'); return <button {...props} type="button" aria-label="Close" data-slot="drawer-close" class={cn(drawerCloseClassName, props.class)} onClick={(e) => { (props.onClick as any)?.(e); if (!e.defaultPrevented) drawer.close({ source: 'close-button', event: e }) }}>{props.children ?? <CloseIcon class="size-4" />}</button> }
export { Drawer as DrawerRoot }
