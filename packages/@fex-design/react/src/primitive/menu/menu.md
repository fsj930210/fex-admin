# Menu primitive

Menu provides one compositional foundation for vertical action menus, horizontal navigation,
menubars, inline trees and Popover-backed nested menus. It does not accept an `items` array and it
does not duplicate Dropdown, ContextMenu or Popover behavior.

## Import

```tsx
import { MenuItem, MenuList, MenuRoot } from '@fex-design/react/primitive/menu'
```

## Direction

`MenuList` defaults to `vertical`. Set `orientation="horizontal"` for a navigation row. Arrow keys,
Home, End, disabled-item skipping and roving tabindex follow the current list orientation. Nested
lists declare their own orientation.

```tsx
<MenuRoot role="navigation">
  <MenuList orientation="horizontal">
    <MenuItem value="home">{({ props }) => <a {...props} href="/">Home</a>}</MenuItem>
  </MenuList>
</MenuRoot>
```

## Nested menus

Inline nesting renders another `MenuList` in the document flow. Floating nesting composes the same
list with `PopoverRoot`, `PopoverTrigger`, `PopoverPortal` and `PopoverContent`. Popover owns trigger
strategy, delays, placement and dismissal; Menu owns item focus and parent/child keyboard movement.
Set `submenu` on the trigger item and match its `value` with the child list `parentValue`.

## Parts

| Part | Purpose |
| --- | --- |
| `MenuRoot` | Semantic container; its native `role` can be `menu`, `menubar` or `navigation`. |
| `MenuList` | One focus/navigation level with `orientation` and optional `parentValue`. |
| `MenuItem` | Default button or render-prop binding for a custom link/button trigger. |
| `MenuGroup` | Semantic item group. |
| `MenuGroupLabel` | Accessible group label content. |
| `MenuDivider` | Separator between groups. |

Menu does not implement text search. Command-style filtering belongs to the composing component.
