# Menu

Angular Menu renders a nested menu body with expansion and selection key arrays.

## Import

```ts
import Menu from '@fex/components-angular/ui/menu'
```

## Basic Usage

```html
<fex-menu [items]="items" [defaultExpandKeys]="['system']" />
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

## Outputs

| Name | Payload | Description |
| --- | --- | --- |
| `expandChange` | `[keys, info]` | Fires when expanded keys change. |
| `select` | `[keys, info]` | Fires when selected keys change. |

## Notes

Menu is the body only. Dropdown, ContextMenu, Menubar and Sidebar should compose it.
