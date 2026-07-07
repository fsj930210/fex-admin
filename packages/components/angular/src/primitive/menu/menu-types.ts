import type { TreeKey } from "@fex/utils/tree";

export type MenuKey = TreeKey;
export type MenuItem = MenuNodeItem | MenuGroupItem | MenuDividerItem;

export interface MenuNodeItem {
  key: MenuKey;
  label: string;
  icon?: string;
  suffix?: string;
  disabled?: boolean;
  children?: readonly MenuItem[];
}

export interface MenuGroupItem {
  type: "group";
  key?: MenuKey;
  label?: string;
  children: readonly MenuNodeItem[];
}

export interface MenuDividerItem {
  type: "divider";
  key?: MenuKey;
}

export interface MenuNodeEntry {
  node: MenuNodeItem;
  key: MenuKey;
  parent?: MenuItem;
  parentKey?: MenuKey;
  level: number;
  index: number;
  path: MenuItem[];
  keyPath: MenuKey[];
  hasChildren: boolean;
}

export interface MenuRenderItemInfo {
  item: MenuNodeItem;
  key: MenuKey;
  level: number;
  index: number;
  selected: boolean;
  expanded: boolean;
  disabled: boolean;
  hasChildren: boolean;
}
