import { createContext, use } from 'react'
import type { UseMenuReturn } from './menu-types'

export const MenuContext = createContext<UseMenuReturn | null>(null)

export function useMenuContext(component: string) {
  const context = use(MenuContext)
  if (!context) {
    throw new Error(`${component} must be used inside MenuRoot.`)
  }

  return context
}
