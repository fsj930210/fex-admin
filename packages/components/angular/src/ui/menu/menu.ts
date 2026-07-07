import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, TemplateRef, computed, input, output, signal } from "@angular/core";
import {
  menuDividerClassName,
  menuExpandIconClassName,
  menuGroupClassName,
  menuGroupLabelClassName,
  menuItemClassName,
  menuItemIconClassName,
  menuItemLabelClassName,
  menuItemSuffixClassName,
  menuListClassName,
  menuRootClassName,
  menuSubMenuContentClassName,
  menuSubMenuInnerClassName,
} from "@fex/components-styles/menu";
import { cn } from "@fex/utils";
import {
  getMenuNodeEntries,
  isMenuNodeItem,
  normalizeMenuKeys,
} from "../../primitive/menu/menu";
import type {
  MenuItem,
  MenuKey,
  MenuNodeEntry,
  MenuRenderItemInfo,
} from "../../primitive/menu/menu-types";

@Component({
  selector: "fex-menu",
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: "menu",
    "data-slot": "menu",
    "[attr.data-orientation]": "orientation()",
    "[class]": "rootClassName()",
  },
  templateUrl: "./menu.html",
})
export class Menu {
  items = input<readonly MenuItem[]>([]);
  expandKeys = input<readonly MenuKey[] | undefined>();
  defaultExpandKeys = input<readonly MenuKey[] | undefined>();
  expandMultiple = input(true);
  selectedKeys = input<readonly MenuKey[] | undefined>();
  defaultSelectedKeys = input<readonly MenuKey[] | undefined>();
  selectMultiple = input(false);
  selectable = input(true);
  disabled = input(false);
  orientation = input<"vertical" | "horizontal">("vertical");
  indent = input(18);
  itemTemplate = input<TemplateRef<{ $implicit: MenuRenderItemInfo }> | undefined>();

  expandChange = output<[MenuKey[], MenuRenderItemInfo]>();
  select = output<[MenuKey[], MenuRenderItemInfo]>();

  protected readonly isMenuNodeItem = isMenuNodeItem;
  protected readonly menuItemIconClassName = menuItemIconClassName;
  protected readonly menuItemLabelClassName = menuItemLabelClassName;
  protected readonly menuItemSuffixClassName = menuItemSuffixClassName;
  protected readonly menuExpandIconClassName = menuExpandIconClassName;
  protected readonly menuSubMenuContentClassName = menuSubMenuContentClassName;
  protected readonly menuSubMenuInnerClassName = menuSubMenuInnerClassName;
  protected readonly menuGroupClassName = menuGroupClassName;
  protected readonly menuGroupLabelClassName = menuGroupLabelClassName;
  protected readonly menuDividerClassName = menuDividerClassName;

  private readonly uncontrolledExpandKeys = signal<MenuKey[] | undefined>(undefined);
  private readonly uncontrolledSelectedKeys = signal<MenuKey[] | undefined>(undefined);

  protected readonly rootClassName = computed(() => cn(menuRootClassName({})));
  protected readonly listClassName = computed(() => cn(menuListClassName({ orientation: this.orientation() })));
  protected readonly nodeEntries = computed(() => getMenuNodeEntries(this.items()));
  protected readonly entryMap = computed(() => new Map(this.nodeEntries().map((entry) => [entry.key, entry])));
  protected readonly currentExpandKeys = computed(() =>
    this.expandKeys()
      ? [...this.expandKeys()!]
      : this.uncontrolledExpandKeys() ?? normalizeMenuKeys(this.defaultExpandKeys(), this.expandMultiple()),
  );
  protected readonly currentSelectedKeys = computed(() =>
    this.selectedKeys()
      ? [...this.selectedKeys()!]
      : this.uncontrolledSelectedKeys() ?? normalizeMenuKeys(this.defaultSelectedKeys(), this.selectMultiple()),
  );

  protected entryFor(item: MenuItem) {
    return "type" in item ? undefined : this.entryMap().get(item.key);
  }

  protected itemClassName() {
    return cn(menuItemClassName({ orientation: this.orientation() }));
  }

  protected itemStyle(info: MenuRenderItemInfo) {
    return this.orientation() === "horizontal"
      ? null
      : `padding-left: calc(var(--menu-item-padding-x) + ${info.level * this.indent()}px)`;
  }

  protected getItemInfo(entry: MenuNodeEntry): MenuRenderItemInfo {
    return {
      item: entry.node,
      key: entry.key,
      level: entry.level,
      index: entry.index,
      selected: this.currentSelectedKeys().includes(entry.key),
      expanded: this.currentExpandKeys().includes(entry.key),
      disabled: this.disabled() || entry.node.disabled === true,
      hasChildren: entry.hasChildren,
    };
  }

  protected clickItem(info: MenuRenderItemInfo, hidden = false) {
    if (hidden || info.disabled) return;
    if (info.hasChildren) {
      const nextKeys = normalizeMenuKeys(
        info.expanded
          ? this.currentExpandKeys().filter((key) => key !== info.key)
          : [...this.currentExpandKeys(), info.key],
        this.expandMultiple(),
      );
      if (this.expandKeys() === undefined) this.uncontrolledExpandKeys.set(nextKeys);
      this.expandChange.emit([nextKeys, info]);
      return;
    }
    if (!this.selectable()) return;
    const nextKeys = normalizeMenuKeys(
      this.selectMultiple()
        ? info.selected
          ? this.currentSelectedKeys().filter((key) => key !== info.key)
          : [...this.currentSelectedKeys(), info.key]
        : [info.key],
      this.selectMultiple(),
    );
    if (this.selectedKeys() === undefined) this.uncontrolledSelectedKeys.set(nextKeys);
    this.select.emit([nextKeys, info]);
  }

  protected keyFor(item: MenuItem, index: number) {
    return "type" in item ? item.key ?? `${item.type}-${index}` : item.key;
  }
}

export default Menu;
