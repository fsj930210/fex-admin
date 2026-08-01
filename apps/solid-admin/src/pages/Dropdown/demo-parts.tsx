import type { JSX, ParentProps } from 'solid-js'
import { MenuItem, MenuList, MenuRoot } from '@fex/components-solid/primitive/menu'

export const triggerClassName = 'inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm hover:bg-muted-background'
export const itemClassName = 'flex h-7 w-full items-center justify-between gap-2 rounded-md px-1.5 text-left text-sm text-foreground hover:bg-muted-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus'
export function MenuSurface(props: ParentProps) { return <MenuRoot><MenuList class="space-y-0.5">{props.children}</MenuList></MenuRoot> }
export function MenuAction(props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) { return <MenuItem {...props} class={itemClassName}>{props.children}</MenuItem> }
