import { menuItemClassName, menuListClassName, menuRootClassName } from '@fex-design/styles/menu'

export const rootClassName = menuRootClassName({ size: 'md' })
export const horizontalListClassName = menuListClassName({ orientation: 'horizontal' })
export const verticalListClassName = menuListClassName({ orientation: 'vertical' })
export const horizontalItemClassName = menuItemClassName({ orientation: 'horizontal' })
export const verticalItemClassName = menuItemClassName({ orientation: 'vertical' })
export const popupClassName = 'min-w-44 rounded-md border border-border bg-background p-1 shadow-lg'
export const menubarClassName = 'inline-flex h-10 items-center rounded-md border border-border bg-background p-1 shadow-xs'
export const menubarTriggerClassName = 'flex h-8 items-center rounded-sm px-3 text-sm font-medium outline-none hover:bg-muted-background focus-visible:bg-muted-background'
export const navTriggerClassName = 'inline-flex h-9 items-center justify-center gap-1 rounded-md px-4 text-sm font-medium leading-none outline-none hover:bg-muted-background focus-visible:bg-muted-background'
export const navListClassName = 'flex items-center gap-1'
export const navPanelClassName = 'w-[520px] rounded-md border border-border bg-background p-3 shadow-lg'
