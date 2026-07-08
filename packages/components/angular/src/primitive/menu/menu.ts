import type {
  MenuItem,
  MenuKey,
  MenuNodeEntry,
  MenuNodeItem,
} from "./menu-types";

export function isMenuNodeItem(item: MenuItem): item is MenuNodeItem {
  return !("type" in item);
}

function getMenuItemKey(item: MenuItem): MenuKey {
  return isMenuNodeItem(item) ? item.key : item.key ?? item.type;
}

function getMenuItemChildren(item: MenuItem): readonly MenuItem[] | undefined {
  return isMenuNodeItem(item) || item.type === "group" ? item.children : undefined;
}

export function getMenuNodeEntries(items: readonly MenuItem[]): MenuNodeEntry[] {
  const entries: MenuNodeEntry[] = [];

  function visit(
    nodes: readonly MenuItem[],
    parent: MenuItem | undefined,
    parentKey: MenuKey | undefined,
    level: number,
    path: MenuItem[],
    keyPath: MenuKey[],
  ) {
    for (const [index, node] of nodes.entries()) {
      const key = getMenuItemKey(node);
      const children = getMenuItemChildren(node);
      const entryPath = [...path, node];
      const entryKeyPath = [...keyPath, key];

      if (isMenuNodeItem(node)) {
        const entry: MenuNodeEntry = {
          node,
          key,
          level,
          index,
          path: entryPath,
          keyPath: entryKeyPath,
          hasChildren: Boolean(children?.length),
        };

        if (parent !== undefined) {
          entry.parent = parent;
        }
        if (parentKey !== undefined) {
          entry.parentKey = parentKey;
        }
        entries.push(entry);
      }

      if (children?.length) {
        visit(children, node, key, level + 1, entryPath, entryKeyPath);
      }
    }
  }

  visit(items, undefined, undefined, 0, [], []);
  return entries;
}

export function normalizeMenuKeys(keys: readonly MenuKey[] | undefined, multiple: boolean) {
  const result: MenuKey[] = [];
  const seen = new Set<MenuKey>();
  for (const key of keys ?? []) {
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(key);
    if (!multiple) break;
  }
  return result;
}
