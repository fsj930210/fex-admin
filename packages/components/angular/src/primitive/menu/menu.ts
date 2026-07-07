// @ts-nocheck
export function isMenuNodeItem(item) {
  return !("type" in item);
}

function getMenuItemKey(item) {
  return isMenuNodeItem(item) ? item.key : item.key ?? item.type;
}

function getMenuItemChildren(item) {
  return isMenuNodeItem(item) || item.type === "group" ? item.children : undefined;
}

export function getMenuNodeEntries(items) {
  const entries = [];

  function visit(nodes, parent, parentKey, level, path, keyPath) {
    for (const [index, node] of nodes.entries()) {
      const key = getMenuItemKey(node);
      const children = getMenuItemChildren(node);
      const entry = {
        node,
        key,
        level,
        index,
        path: [...path, node],
        keyPath: [...keyPath, key],
        hasChildren: Boolean(children?.length),
      };

      if (parent !== undefined) {
        entry.parent = parent;
      }
      if (parentKey !== undefined) {
        entry.parentKey = parentKey;
      }
      if (isMenuNodeItem(node)) {
        entries.push(entry);
      }
      if (children?.length) {
        visit(children, node, key, level + 1, entry.path, entry.keyPath);
      }
    }
  }

  visit(items, undefined, undefined, 0, [], []);
  return entries;
}

export function normalizeMenuKeys(keys, multiple) {
  const result = [];
  const seen = new Set();
  for (const key of keys ?? []) {
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(key);
    if (!multiple) break;
  }
  return result;
}
