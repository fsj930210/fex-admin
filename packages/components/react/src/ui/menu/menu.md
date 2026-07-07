# Menu

Menu renders a nested menu tree with shared expansion and selection behavior. It is the menu body only; dropdown triggers, context menu triggers, floating layers, menubars and sidebar containers should compose Menu instead of being implemented inside it.

## Import

```tsx
import { Menu } from '@fex/components-react/ui/menu'
```

For custom DOM, use the primitive logic entry:

```tsx
import { useMenu } from '@fex/components-react/primitive/menu'
```

## Basic Usage

```tsx
import { Menu } from '@fex/components-react/ui/menu'

const items = [
  {
    key: 'dashboard',
    label: 'Dashboard',
  },
  {
    key: 'system',
    label: 'System',
    children: [
      { key: 'users', label: 'Users' },
      { key: 'roles', label: 'Roles' },
    ],
  },
]

export function Demo() {
  return <Menu items={items} defaultSelectedKeys={['dashboard']} />
}
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `MenuItem[]` | `[]` | No | Menu tree data. |
| `expandKeys` | `MenuKey[]` | - | No | Controlled expanded keys. |
| `defaultExpandKeys` | `MenuKey[]` | - | No | Initial expanded keys for uncontrolled mode. |
| `expandMultiple` | `boolean` | `true` | No | Whether multiple parent items can be expanded at the same time. |
| `selectedKeys` | `MenuKey[]` | - | No | Controlled selected keys. |
| `defaultSelectedKeys` | `MenuKey[]` | - | No | Initial selected keys for uncontrolled mode. |
| `selectMultiple` | `boolean` | `false` | No | Whether multiple leaf items can be selected. |
| `selectable` | `boolean` | `true` | No | Whether leaf item clicks update selection. |
| `disabled` | `boolean` | `false` | No | Disables all menu items. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | No | Menu body layout direction. It does not add dropdown or popup behavior. |
| `indent` | `number` | `18` | No | Pixel indent added per nesting level. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Default menu density. |
| `renderItem` | `(info) => ReactNode` | - | No | Fully custom item content. |
| `renderSuffix` | `(info) => ReactNode` | - | No | Custom right-side content such as badges, counts or shortcuts. |
| `renderExpandIcon` | `(info) => ReactNode` | - | No | Custom expand icon for parent items. |
| `onExpandChange` | `(keys, info) => void` | - | No | Called after expanded keys change. |
| `onSelect` | `(keys, info) => void` | - | No | Called after a key becomes selected. |
| `onDeselect` | `(keys, info) => void` | - | No | Called after a key becomes deselected. |
| `onClick` | `(info) => void` | - | No | Called when an enabled item is clicked or activated by keyboard. |
| `className` | `MenuClassName` | - | No | Structured class names for root, item, label, suffix and other parts. |
| `style` | `MenuStyle` | - | No | Structured styles for root and item. |

## MenuItem

```ts
type MenuItem = MenuNodeItem | MenuGroupItem | MenuDividerItem

type MenuNodeItem = {
  key: string | number
  label: ReactNode
  icon?: ReactNode
  suffix?: ReactNode
  disabled?: boolean
  children?: MenuItem[]
}

type MenuGroupItem = {
  type: 'group'
  key?: string | number
  label?: ReactNode
  children: MenuNodeItem[]
}

type MenuDividerItem = {
  type: 'divider'
  key?: string | number
}
```

## Controlled State

Expansion and selection both support controlled and uncontrolled modes.

```tsx
import { useState } from 'react'
import { Menu, type MenuKey } from '@fex/components-react/ui/menu'

export function ControlledDemo() {
  const [expandKeys, setExpandKeys] = useState<MenuKey[]>(['system'])
  const [selectedKeys, setSelectedKeys] = useState<MenuKey[]>(['users'])

  return (
    <Menu
      items={items}
      expandKeys={expandKeys}
      selectedKeys={selectedKeys}
      expandMultiple={false}
      onExpandChange={setExpandKeys}
      onSelect={setSelectedKeys}
    />
  )
}
```

## Custom Rendering

Use `suffix` for simple right-side content, `renderSuffix` for computed right-side content, and `renderItem` when the entire item body needs to be replaced.

```tsx
<Menu
  items={items}
  renderSuffix={({ item }) => item.key === 'messages' ? <span>12</span> : null}
/>
```

```tsx
<Menu
  items={items}
  renderItem={({ item, selected, expanded }) => (
    <>
      {item.icon}
      <span data-selected={selected}>{item.label}</span>
      {item.children ? <span>{expanded ? 'open' : 'closed'}</span> : null}
    </>
  )}
/>
```

## Headless Usage

`useMenu` composes the shared expansion controller, selection controller and `@fex/utils/tree` traversal results. Consumers can build their own DOM without using the default UI.

```tsx
import { useMenu } from '@fex/components-react/primitive/menu'

export function CustomMenu({ items }) {
  const menu = useMenu({ items })

  return (
    <nav {...menu.getRootProps()}>
      {menu.nodeItems.map((entry) => {
        const info = menu.getItemInfo(entry)
        return (
          <button key={info.key} {...menu.getItemProps(entry)}>
            {info.item.label}
          </button>
        )
      })}
    </nav>
  )
}
```

## Notes

- Menu does not own popup positioning or trigger behavior. Compose it inside Dropdown, ContextMenu or Sidebar components.
- Parent items toggle expansion. Leaf items update selection when `selectable` is true.
- `expandMultiple={false}` gives accordion-like expansion without requiring each app to rewrite key-array logic.
