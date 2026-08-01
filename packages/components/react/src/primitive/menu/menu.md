# Menu Primitive

The primitive Menu API exposes `useMenu` and small structural parts for custom rendering. `useMenu` combines shared expansion, shared selection and tree traversal metadata; it does not include styling, popups, triggers or sidebar layout.

## Import

```tsx
import { MenuItem, MenuList, MenuRoot, useMenu } from '@fex/components-react/primitive/menu'
```

## Structural usage

`MenuRoot`, `MenuList`, and `MenuItem` are children-based primitives and never accept `items`.

```tsx
<MenuRoot>
  <MenuList>
    <MenuItem>Rename</MenuItem>
    <MenuItem disabled>Archive</MenuItem>
  </MenuList>
</MenuRoot>
```

Use the independent `useMenu({ items })` logic API only when building a data-driven renderer.

## Headless Usage

```tsx
import { useMenu } from '@fex/components-react/primitive/menu'

export function CustomMenu({ items }) {
  const menu = useMenu({ items, defaultExpandKeys: ['system'] })

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

## Controlled And Uncontrolled

`expandKeys/defaultExpandKeys` control expansion. `selectedKeys/defaultSelectedKeys` control selection. `expandMultiple` and `selectMultiple` keep common array-key behavior inside the shared logic instead of forcing every app to repeat it.
