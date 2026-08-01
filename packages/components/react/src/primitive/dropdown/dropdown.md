# Dropdown primitive

Dropdown is a semantic composition of the existing Popover and Menu primitives. It does not define
menu data or duplicate Menu parts.

## Import

```tsx
import { DropdownContent, DropdownRoot, DropdownTrigger } from '@fex/components-react/primitive/dropdown'
import { MenuItem, MenuList, MenuRoot } from '@fex/components-react/primitive/menu'
import { PopoverPortal } from '@fex/components-react/primitive/popover'
```

## Basic composition

```tsx
<DropdownRoot>
  <DropdownTrigger>{(props) => <button {...props}>Actions</button>}</DropdownTrigger>
  <PopoverPortal container={container}>
    <DropdownContent>
      <MenuRoot><MenuList><MenuItem>Rename</MenuItem></MenuList></MenuRoot>
    </DropdownContent>
  </PopoverPortal>
</DropdownRoot>
```

## Props

| Part | Props | Notes |
| --- | --- | --- |
| `DropdownRoot` | `PopoverRootProps` | Controlled `open`, `defaultOpen`, `onOpenChange`, triggers, placement, offsets and dismiss behavior. |
| `DropdownTrigger` | `PopoverTriggerProps` | Render prop that returns native bindings and a ref; sets `aria-haspopup="menu"`. |
| `DropdownContent` | `PopoverContentProps` | Native div props; defaults to `role="menu"`. |

## Events and state

Root controlled/uncontrolled behavior is identical to Popover. Clicking a leaf element with
`role="menuitem"` closes the current Dropdown and its ancestor submenu chain. Preventing the click default keeps it open; an item
with `aria-haspopup` is treated as a nested-menu trigger and stays open.

## Portal, custom panels, and nesting

Use `PopoverPortal container={element}` for a concrete mount node, or `getPopupContainer` on the
root for a resolver. For a custom panel, override the content role. A nested menu is a Menu item used
as another `PopoverTrigger`, with the same Menu primitive rendered in its Popover content.
