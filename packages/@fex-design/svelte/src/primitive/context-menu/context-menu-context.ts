import type { ContextMenuController, ContextMenuSnapshot } from '@fex-design/core/overlay/context-menu/types'
import type { Readable } from 'svelte/store'

export const contextMenuContextKey = Symbol('fex-context-menu')

export interface ContextMenuContext<T = unknown> {
  controller: ContextMenuController<T>
  snapshot: Readable<ContextMenuSnapshot<T>>
}
