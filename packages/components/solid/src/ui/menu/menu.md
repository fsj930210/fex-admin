# Menu

Solid Menu renders a nested menu body with expansion and selection key arrays.

## Import

```tsx
import { Menu } from '@fex/components-solid/ui/menu'
```

## Basic Usage

```tsx
const items = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'system', label: 'System', children: [{ key: 'users', label: 'Users' }] },
]

<Menu items={items} defaultExpandKeys={['system']} />
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `MenuItem[]` | `[]` | No | Menu tree data. |
| `expandKeys` | `MenuKey[]` | - | No | Controlled expanded keys. |
| `defaultExpandKeys` | `MenuKey[]` | - | No | Initial expanded keys. |
| `expandMultiple` | `boolean` | `true` | No | Allows multiple expanded parent items. |
| `selectedKeys` | `MenuKey[]` | - | No | Controlled selected keys. |
| `defaultSelectedKeys` | `MenuKey[]` | - | No | Initial selected keys. |
| `selectMultiple` | `boolean` | `false` | No | Allows multiple selected leaf items. |
| `selectable` | `boolean` | `true` | No | Whether leaf clicks update selection. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | No | Menu body direction. |
| `indent` | `number` | `18` | No | Nested indent in pixels. |
| `renderSuffix` | `(info) => JSX.Element` | - | No | Renders right-side content. |
| `renderItem` | `(info) => JSX.Element` | - | No | Replaces item content. |

## Events

| Name | Type | Description |
| --- | --- | --- |
| `onExpandChange` | `(keys, info) => void` | Fires when expanded keys change. |
| `onSelect` | `(keys, info) => void` | Fires when selected keys change. |

## Notes

Menu is not a popup component. Compose it with Dropdown or Popover for nested horizontal popup menus.
