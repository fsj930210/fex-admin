import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import { RouterLink } from '@angular/router'
import Card from '@fex/components-angular/ui/card'
import Menu from '@fex/components-angular/ui/menu'
import { getMenuNodeEntries, normalizeMenuKeys } from '@fex/components-angular/primitive/menu'
import type {
  MenuItem,
  MenuKey,
  MenuNodeEntry,
  MenuRenderItemInfo,
} from '@fex/components-angular/primitive/menu-types'
import { MinusIcon } from '@fex/components-angular/icon/minus'
import { PlusIcon } from '@fex/components-angular/icon/plus'

@Component({
  selector: 'fex-menu-page',
  imports: [NgTemplateOutlet, RouterLink, Card, Menu, MinusIcon, PlusIcon],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  protected readonly menuItems: MenuItem[] = [
    { key: 'dashboard', label: 'Dashboard', icon: 'D' },
    {
      key: 'system',
      label: 'System',
      icon: 'S',
      children: [
        { key: 'users', label: 'Users', suffix: '24' },
        { key: 'roles', label: 'Roles' },
        { key: 'permissions', label: 'Permissions', disabled: true },
      ],
    },
    {
      key: 'content',
      label: 'Content',
      icon: 'C',
      children: [
        { key: 'articles', label: 'Articles' },
        { key: 'comments', label: 'Comments', suffix: '8' },
      ],
    },
    { type: 'divider' },
    {
      type: 'group',
      label: 'Workspace',
      children: [
        { key: 'settings', label: 'Settings' },
        { key: 'billing', label: 'Billing' },
      ],
    },
  ]

  protected readonly horizontalItems: MenuItem[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'members', label: 'Members', suffix: '12' },
    { key: 'settings', label: 'Settings' },
  ]

  protected readonly expandKeys = signal<MenuKey[]>(['system'])
  protected readonly selectedKeys = signal<MenuKey[]>(['users'])
  protected readonly headlessExpandKeys = signal<MenuKey[]>(['system'])
  protected readonly headlessSelectedKeys = signal<MenuKey[]>(['roles'])
  protected readonly headlessEntries = getMenuNodeEntries(this.menuItems)
  protected readonly headlessEntryMap = new Map(
    this.headlessEntries.map((entry) => [entry.key, entry]),
  )
  protected readonly headlessRootItems = this.menuItems

  protected setExpandKeys(event: [MenuKey[], MenuRenderItemInfo]) {
    this.expandKeys.set(event[0])
  }

  protected setSelectedKeys(event: [MenuKey[], MenuRenderItemInfo]) {
    this.selectedKeys.set(event[0])
  }

  protected headlessEntryFor(key: MenuKey) {
    return this.headlessEntryMap.get(key)
  }

  protected isMenuNodeItem(item: MenuItem) {
    return !('type' in item)
  }

  protected headlessInfo(entry: MenuNodeEntry) {
    return {
      selected: this.headlessSelectedKeys().includes(entry.key),
      expanded: this.headlessExpandKeys().includes(entry.key),
      hasChildren: entry.hasChildren,
      disabled: entry.node.disabled === true,
    }
  }

  protected headlessStyle(entry: MenuNodeEntry) {
    return `padding-left: ${8 + entry.level * 18}px`
  }

  protected clickHeadless(entry: MenuNodeEntry) {
    const info = this.headlessInfo(entry)
    if (info.disabled) return
    if (info.hasChildren) {
      this.headlessExpandKeys.set(
        normalizeMenuKeys(
          info.expanded
            ? this.headlessExpandKeys().filter((key) => key !== entry.key)
            : [...this.headlessExpandKeys(), entry.key],
          true,
        ),
      )
      return
    }
    this.headlessSelectedKeys.set([entry.key])
  }

  protected keyForHeadlessItem(item: MenuItem, index: number) {
    return 'type' in item ? (item.key ?? `${item.type}-${index}`) : item.key
  }
}
