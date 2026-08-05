import type { ContextMenuController } from '@fex-design/core/overlay/context-menu/types'
import type { InjectionKey, Ref } from 'vue'
import { inject } from 'vue'

export interface ContextMenuContext<T = unknown> {
  controller: ContextMenuController<T>
  snapshot: Ref<ReturnType<ContextMenuController<T>['getSnapshot']>>
}

export const contextMenuKey: InjectionKey<ContextMenuContext> = Symbol('fex-context-menu')

export function useContextMenuContext<T = unknown>(name = 'ContextMenu') {
  const context = inject(contextMenuKey) as ContextMenuContext<T> | undefined
  if (!context) throw new Error(`${name} must be used inside ContextMenuRoot.`)
  return context
}
