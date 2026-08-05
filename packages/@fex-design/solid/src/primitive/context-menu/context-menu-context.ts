import { createContext, useContext } from 'solid-js'
import type { Accessor } from 'solid-js'
import type { ContextMenuController, ContextMenuSnapshot } from '@fex-design/core/overlay/context-menu/types'

export interface ContextMenuContextValue<T = unknown> {
  controller: ContextMenuController<T>
  snapshot: Accessor<ContextMenuSnapshot<T>>
}

export const ContextMenuContext = createContext<ContextMenuContextValue<any>>()

export function useContextMenuContext<T = unknown>(component = 'ContextMenu') {
  const context = useContext(ContextMenuContext) as ContextMenuContextValue<T> | undefined
  if (!context) throw new Error(`${component} must be used inside ContextMenu.`)
  return context
}
