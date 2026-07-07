# Menu

Vue Menu renders a nested menu body. It owns item rendering, expansion keys and selected keys, but it does not own dropdown triggers, context-menu triggers or floating popup behavior.

## Import

```ts
import { Menu } from '@fex/components-vue/ui/menu'
```

## Basic Usage

```vue
<script setup lang="ts">
import { Menu, type MenuItem } from '@fex/components-vue/ui/menu'

const items: MenuItem[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'system', label: 'System', children: [{ key: 'users', label: 'Users' }] },
]
</script>

<template>
  <Menu :items="items" :default-expand-keys="['system']" />
</template>
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

## Events

| Name | Payload | Description |
| --- | --- | --- |
| `expandChange` | `(keys, info)` | Fires when expanded keys change. |
| `select` | `(keys, info)` | Fires when selected keys change. |

## Notes

Horizontal Menu only lays out top-level items. Nested horizontal popup menus should be composed with Dropdown or Popover.
