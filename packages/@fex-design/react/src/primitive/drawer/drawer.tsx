import { createPortal } from 'react-dom'
import { use, useEffect, useId, useRef, type ComponentProps, type KeyboardEvent, type MouseEvent, type ReactNode, type Ref } from 'react'
import { createDrawerController, type DrawerOptions, type DrawerPlacement, type DrawerSize } from '@fex-design/core/drawer/create-drawer-controller'
import type { DisclosureChangeInfo } from '@fex-design/core/disclosure/create-disclosure'
import { drawerBodyClassName, drawerCloseClassName, drawerContentClassName, drawerFooterClassName, drawerHeaderClassName, drawerMaskClassName, drawerResizeHandleClassName } from '@fex-design/styles/drawer'
import { cn, shallowEqualObject } from '@fex/utils'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { useLazyRef } from '../../hooks/use-lazy-ref'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
import { useResize } from '../../hooks/use-resize'
import { useCoreStore } from '../../hooks/use-core-store'
import { CloseIcon } from '../../icon/close'
import { DrawerContext, DrawerResizeContext } from './drawer-context'

const edges: Record<DrawerPlacement, 'left' | 'right' | 'top' | 'bottom'> = { left: 'right', right: 'left', top: 'bottom', bottom: 'top' }
const presets: Record<string, number | string> = { sm: 320, md: 400, lg: 560, xl: 720, full: '100%' }
function px(value: DrawerSize | undefined) { if (typeof value === 'number') return `${value}px`; return `${presets[value ?? 'md'] ?? value ?? 400}${typeof (presets[value ?? 'md'] ?? value) === 'number' ? 'px' : ''}` }

export interface DrawerRootProps extends DrawerOptions { children?: ReactNode; size?: DrawerSize; defaultSize?: DrawerSize; resizable?: boolean; minSize?: number; maxSize?: number; onSizeChange?: (size: number) => void }
export function DrawerRoot({ children, open: openProp, defaultOpen, onOpenChange, placement = 'right', size, defaultSize = 'md', resizable = false, minSize = 240, maxSize, onSizeChange, ...options }: DrawerRootProps) {
  const parent = use(DrawerContext)
  const depth = (parent?.depth ?? -1) + 1
  const controlled = openProp !== undefined
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const handleOpenChange = useMemoizedFn((next: boolean, info: DisclosureChangeInfo) => onOpenChange?.(next, info))
  const drawerOptions = { ...options, defaultOpen, placement, onOpenChange: handleOpenChange, ...(controlled ? { open: openProp } : {}) }
  const drawer = useLazyRef(() => createDrawerController(drawerOptions)).current
  const latest = useRef(drawerOptions)
  useIsomorphicLayoutEffect(() => { if (!shallowEqualObject(latest.current, drawerOptions)) { latest.current = drawerOptions; drawer.setOptions(drawerOptions) } })
  const mountedRef = useRef(false)
  // React Strict Mode runs an extra effect cleanup/setup cycle in development. Defer destruction
  // so that cycle can reclaim the controller while a real unmount still releases subscriptions.
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      queueMicrotask(() => { if (!mountedRef.current) drawer.destroy() })
    }
  }, [drawer])
  const contentId = useId()
  return <DrawerContext.Provider value={{ drawer, contentId, triggerRef, mask: options.mask ?? true, depth, resizeOptions: { ...(size === undefined ? {} : { size }), resizable, minSize, ...(maxSize === undefined ? {} : { maxSize }), ...(onSizeChange === undefined ? {} : { onSizeChange }) } }}>{children}</DrawerContext.Provider>
}

function useDrawer() { const value = use(DrawerContext); if (!value) throw new Error('Drawer primitive must be used inside DrawerRoot'); return value }

export interface DrawerTriggerProps extends Omit<ComponentProps<'button'>, 'children' | 'ref'> { children: (props: ComponentProps<'button'> & { 'data-state': string }) => ReactNode; ref?: Ref<HTMLButtonElement> }
export function DrawerTrigger({ children, onClick, ref, ...props }: DrawerTriggerProps) { const { drawer, triggerRef } = useDrawer(); const snapshot = useCoreStore(drawer); return children({ ...props, ref: (element: HTMLButtonElement | null) => { triggerRef.current = element; if (typeof ref === 'function') ref(element); else if (ref && 'current' in ref) ref.current = element }, 'data-state': snapshot.open ? 'open' : 'closed', onClick: (e) => { onClick?.(e); if (!e.defaultPrevented) drawer.toggle({ source: 'trigger' }) } }) }
export function DrawerPortal({ children, container, forceMount }: { children?: ReactNode; container?: HTMLElement | null; forceMount?: boolean }) { const { drawer, depth } = useDrawer(); const snapshot = useCoreStore(drawer); const target = container ?? globalThis.document?.body; return target && (snapshot.mounted || forceMount) ? createPortal(<div style={{ display: 'contents', '--drawer-z-index': 50 + depth * 2 } as React.CSSProperties}>{children}</div>, target) : null }
export function DrawerMask({ className, onClick, ref, style, ...props }: ComponentProps<'div'>) { const { drawer, mask, depth } = useDrawer(); const snapshot = useCoreStore(drawer); const setMask = useMemoizedFn((element: HTMLDivElement | null) => { drawer.setOverlayElement(element); if (typeof ref === 'function') ref(element); else if (ref && 'current' in ref) ref.current = element }); if (!mask) return null; return <div {...props} ref={setMask} data-slot="drawer-mask" data-state={snapshot.open ? 'open' : 'closed'} data-phase={snapshot.phase} style={{ '--drawer-z-index': 50 + depth * 2, ...style } as React.CSSProperties} className={cn(drawerMaskClassName, className)} onClick={(e) => { onClick?.(e); if (!e.defaultPrevented && e.target === e.currentTarget) drawer.dismiss.overlayPointer({ target: e.target, currentTarget: e.currentTarget, event: e.nativeEvent }) }} /> }
export function DrawerContent({ className, style, placement, size = 'md', ref, onKeyDown, children, ...props }: ComponentProps<'div'> & { placement?: DrawerPlacement; size?: DrawerSize; ref?: Ref<HTMLDivElement> }) { const { drawer, contentId, resizeOptions } = useDrawer(); const snapshot = useCoreStore(drawer); const currentPlacement = placement ?? snapshot.placement; const configuredSize = size === 'md' && resizeOptions.size !== undefined ? resizeOptions.size : size; const initial = typeof configuredSize === 'number' ? configuredSize : Number.parseInt(String(presets[configuredSize as string] ?? configuredSize), 10) || 400; const resize = useResize({ defaultRect: { x: 0, y: 0, width: currentPlacement === 'left' || currentPlacement === 'right' ? initial : 0, height: currentPlacement === 'top' || currentPlacement === 'bottom' ? initial : 0 }, edges: [edges[currentPlacement]], disabled: !resizeOptions.resizable, ...(currentPlacement === 'left' || currentPlacement === 'right' ? { ...(resizeOptions.minSize === undefined ? {} : { minWidth: resizeOptions.minSize }), ...(resizeOptions.maxSize === undefined ? {} : { maxWidth: resizeOptions.maxSize }) } : { ...(resizeOptions.minSize === undefined ? {} : { minHeight: resizeOptions.minSize }), ...(resizeOptions.maxSize === undefined ? {} : { maxHeight: resizeOptions.maxSize }) }), onResize: (rect) => { const next = currentPlacement === 'left' || currentPlacement === 'right' ? rect.width : rect.height; resizeOptions.onSizeChange?.(next) } }); const contentRef = useMemoizedFn((element: HTMLDivElement | null) => { drawer.setLayerElement(element); resize.getTargetProps().ref(element); if (typeof ref === 'function') ref(element); else if (ref && 'current' in ref) ref.current = element }); if (!snapshot.mounted) return null; return <DrawerResizeContext value={resize}><div {...props} ref={contentRef} id={contentId} role="dialog" tabIndex={-1} data-slot="drawer-content" data-placement={currentPlacement} data-state={snapshot.open ? 'open' : 'closed'} data-phase={snapshot.phase} style={{ '--drawer-size': px(configuredSize), ...style } as React.CSSProperties} className={cn(drawerContentClassName({ placement: currentPlacement }), className)} onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => { onKeyDown?.(e); if (!e.defaultPrevented && e.key === 'Escape') drawer.dismiss.escapeKey({ target: e.target, currentTarget: e.currentTarget, event: e.nativeEvent }) }}>{children}</div></DrawerResizeContext> }
export function DrawerResizeHandle({ className, ...props }: ComponentProps<'div'>) { const { drawer } = useDrawer(); const snapshot = useCoreStore(drawer); const resize = use(DrawerResizeContext); const edge = edges[snapshot.placement]; return <div {...props} {...resize?.getHandleProps(edge)} data-slot="drawer-resize-handle" data-edge={edge} className={cn(drawerResizeHandleClassName, className)} /> }
export function DrawerHeader({ className, ...props }: ComponentProps<'div'>) { return <div {...props} data-slot="drawer-header" className={cn(drawerHeaderClassName, className)} /> }
export function DrawerBody({ className, ...props }: ComponentProps<'div'>) { return <div {...props} data-slot="drawer-body" className={cn(drawerBodyClassName, className)} /> }
export function DrawerFooter({ className, ...props }: ComponentProps<'div'>) { return <div {...props} data-slot="drawer-footer" className={cn(drawerFooterClassName, className)} /> }
export function DrawerClose({ children, className, onClick, 'aria-label': ariaLabel = 'Close', ...props }: ComponentProps<'button'>) { const { drawer } = useDrawer(); const content = children === '×' || children === '脳' ? <CloseIcon className="size-4" /> : children ?? <CloseIcon className="size-4" />; return <button {...props} type="button" aria-label={ariaLabel} data-slot="drawer-close" className={cn(drawerCloseClassName, className)} onClick={(e: MouseEvent<HTMLButtonElement>) => { onClick?.(e); if (!e.defaultPrevented) drawer.close({ source: 'close-button', event: e.nativeEvent }) }}>{content}</button> }
