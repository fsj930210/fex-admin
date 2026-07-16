import type {
  MenuItem,
  MenuKey,
  MenuNodeEntry,
  MenuRenderItemInfo,
} from '../../primitive/menu/menu-types'
import type { useMenu } from '../../primitive/menu/use-menu'
import { inject, type InjectionKey } from 'vue'
export interface MenuUiContext {
  classNames: Record<string, string | undefined> | undefined
  entryMap: () => Map<MenuKey, MenuNodeEntry>
  indent: number
  menu: ReturnType<typeof useMenu>
  orientation: 'vertical' | 'horizontal'
}
export const menuUiContextKey: InjectionKey<MenuUiContext> = Symbol('menu-ui-context')
export function useMenuUiContext() {
  const context = inject(menuUiContextKey)
  if (!context) throw new Error('MenuItems must be used inside Menu.')
  return context
}
export function isMenuNodeItem(
  item: MenuItem,
): item is import('../../primitive/menu/menu-types').MenuNodeItem {
  return !('type' in item)
}
export function isMenuGroupItem(
  item: MenuItem,
): item is import('../../primitive/menu/menu-types').MenuGroupItem {
  return 'type' in item && item.type === 'group'
}
export type { MenuItem, MenuRenderItemInfo }
