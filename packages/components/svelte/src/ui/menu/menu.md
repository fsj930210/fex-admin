# Menu

Svelte Menu renders a nested menu body with expansion and selection key arrays.

## Import

```svelte
<script lang="ts">
  import Menu from '@fex/components-svelte/ui/menu'
</script>
```

## Basic Usage

```svelte
<Menu {items} defaultExpandKeys={['system']} />
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
| `onExpandChange` | `(keys, info) => void` | - | No | Expansion callback. |
| `onSelect` | `(keys, info) => void` | - | No | Selection callback. |

## Notes

The current Svelte UI accepts string labels, icons and suffixes. Rich popup composition belongs to Dropdown or Popover.
