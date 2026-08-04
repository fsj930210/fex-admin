import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { MenuItem, MenuList, MenuRoot } from '@fex-design/react/primitive/menu'

export const triggerClassName =
  'inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm hover:bg-muted-background'

export function MenuSurface({ children }: { children: ReactNode }) {
  return <MenuRoot><MenuList className="space-y-0.5">{children}</MenuList></MenuRoot>
}

export function MenuAction(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <MenuItem
      {...props}
      type="button"
      role="menuitem"
      className="flex h-7 w-full items-center justify-between gap-2 rounded-md px-1.5 text-left text-sm text-foreground hover:bg-muted-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
    />
  )
}
