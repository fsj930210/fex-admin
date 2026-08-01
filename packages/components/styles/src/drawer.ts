import { cva, type VariantProps } from 'class-variance-authority'

export const drawerMaskClassName = [
  'fixed inset-0 z-[var(--drawer-z-index,50)] bg-black/45',
  'transition-opacity duration-[var(--drawer-motion-duration,300ms)]',
  'data-[phase=opening]:opacity-0 data-[phase=open]:opacity-100 data-[phase=closing]:opacity-0 data-[phase=closed]:opacity-0',
].join(' ')

export const drawerContentClassName = cva([
  'fixed z-[calc(var(--drawer-z-index,50)+1)] flex max-h-dvh max-w-[100vw] flex-col overflow-hidden will-change-transform',
  'border-border bg-background text-foreground shadow-xl outline-none',
  'transition-[transform,opacity] duration-[var(--drawer-motion-duration,300ms)] ease-[var(--drawer-motion-ease,cubic-bezier(0.78,0.14,0.15,0.86))]',
  'data-[phase=closing]:opacity-0 data-[phase=closed]:opacity-0',
], { variants: { placement: {
  left: 'inset-y-0 start-0 w-[var(--drawer-size)] data-[state=open]:animate-drawer-in-left data-[phase=closing]:animate-drawer-out-left',
  right: 'inset-y-0 end-0 w-[var(--drawer-size)] data-[state=open]:animate-drawer-in-right data-[phase=closing]:animate-drawer-out-right',
  top: 'inset-x-0 top-0 h-[var(--drawer-size)] data-[state=open]:animate-drawer-in-top data-[phase=closing]:animate-drawer-out-top',
  bottom: 'inset-x-0 bottom-0 h-[var(--drawer-size)] data-[state=open]:animate-drawer-in-bottom data-[phase=closing]:animate-drawer-out-bottom',
}, size: { sm: '', md: '', lg: '', xl: '', full: '' } }, defaultVariants: { placement: 'right' } })

export const drawerHeaderClassName = 'flex shrink-0 items-center gap-2 border-b border-border p-4'
export const drawerBodyClassName = 'min-h-0 flex-1 overflow-auto p-4'
export const drawerFooterClassName = 'flex shrink-0 items-center justify-end gap-2 border-t border-border p-4'
export const drawerCloseClassName = 'ms-auto inline-flex size-8 items-center justify-center rounded-md hover:bg-muted-background'
export const drawerResizeHandleClassName = [
  'absolute z-10 touch-none select-none',
  'before:absolute before:bg-transparent hover:before:bg-primary/60',
  'data-[edge=left]:inset-y-0 data-[edge=left]:start-0 data-[edge=left]:w-2 data-[edge=left]:cursor-col-resize',
  'data-[edge=left]:before:inset-y-0 data-[edge=left]:before:start-0 data-[edge=left]:before:w-px',
  'data-[edge=right]:inset-y-0 data-[edge=right]:end-0 data-[edge=right]:w-2 data-[edge=right]:cursor-col-resize',
  'data-[edge=right]:before:inset-y-0 data-[edge=right]:before:end-0 data-[edge=right]:before:w-px',
  'data-[edge=top]:inset-x-0 data-[edge=top]:top-0 data-[edge=top]:h-2 data-[edge=top]:cursor-row-resize',
  'data-[edge=top]:before:inset-x-0 data-[edge=top]:before:top-0 data-[edge=top]:before:h-px',
  'data-[edge=bottom]:inset-x-0 data-[edge=bottom]:bottom-0 data-[edge=bottom]:h-2 data-[edge=bottom]:cursor-row-resize',
  'data-[edge=bottom]:before:inset-x-0 data-[edge=bottom]:before:bottom-0 data-[edge=bottom]:before:h-px',
].join(' ')
export type DrawerStyleProps = VariantProps<typeof drawerContentClassName>
