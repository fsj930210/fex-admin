import type { MenuItem as MenuDataItem, MenuKey, MenuNodeEntry, MenuNodeItem } from './menu-types'
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({ selector: 'fex-menu-root', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { role: 'menu', 'data-slot': 'menu' }, template: '<ng-content />' })
export class MenuRoot {}

@Component({ selector: 'fex-menu-list', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { role: 'group', 'data-slot': 'menu-list' }, template: '<ng-content />' })
export class MenuList {}

@Component({ selector: 'button[fexMenuItem]', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { type: 'button', role: 'menuitem', 'data-slot': 'menu-item' }, template: '<ng-content />' })
export class MenuItem {}

export function isMenuNodeItem(item: MenuDataItem): item is MenuNodeItem {
  return !('type' in item)
}

function getMenuItemKey(item: MenuDataItem): MenuKey {
  return isMenuNodeItem(item) ? item.key : (item.key ?? item.type)
}

function getMenuItemChildren(item: MenuDataItem): readonly MenuDataItem[] | undefined {
  return isMenuNodeItem(item) || item.type === 'group' ? item.children : undefined
}

export function getMenuNodeEntries(items: readonly MenuDataItem[]): MenuNodeEntry[] {
  const entries: MenuNodeEntry[] = []

  function visit(
    nodes: readonly MenuDataItem[],
    parent: MenuDataItem | undefined,
    parentKey: MenuKey | undefined,
    level: number,
    path: MenuDataItem[],
    keyPath: MenuKey[],
  ) {
    for (const [index, node] of nodes.entries()) {
      const key = getMenuItemKey(node)
      const children = getMenuItemChildren(node)
      const entryPath = [...path, node]
      const entryKeyPath = [...keyPath, key]

      if (isMenuNodeItem(node)) {
        const entry: MenuNodeEntry = {
          node,
          key,
          level,
          index,
          path: entryPath,
          keyPath: entryKeyPath,
          hasChildren: Boolean(children?.length),
        }

        if (parent !== undefined) {
          entry.parent = parent
        }
        if (parentKey !== undefined) {
          entry.parentKey = parentKey
        }
        entries.push(entry)
      }

      if (children?.length) {
        visit(children, node, key, level + 1, entryPath, entryKeyPath)
      }
    }
  }

  visit(items, undefined, undefined, 0, [], [])
  return entries
}

export function normalizeMenuKeys(keys: readonly MenuKey[] | undefined, multiple: boolean) {
  const result: MenuKey[] = []
  const seen = new Set<MenuKey>()
  for (const key of keys ?? []) {
    if (seen.has(key)) continue
    seen.add(key)
    result.push(key)
    if (!multiple) break
  }
  return result
}
