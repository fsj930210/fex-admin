import { createContext, use } from 'react'
import type { ContextMenuController, ContextMenuSnapshot } from '@fex-design/core/overlay/context-menu/types'

export interface ContextMenuContextValue<T> {
  controller: ContextMenuController<T>
}

export const ContextMenuContext = createContext<ContextMenuContextValue<any> | null>(null)

export function useContextMenuContext<T>(component = 'ContextMenu') {
  const context = use(ContextMenuContext) as ContextMenuContextValue<T> | null
  if (!context) throw new Error(`${component} must be used inside ContextMenuRoot`)
  return context
}

export type { ContextMenuSnapshot }
