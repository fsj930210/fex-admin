# Sortable

Sortable provides quick list sorting on top of `useSortable`. Use the component for standard lists and use the hook directly for tables, transfer panels, grids, and custom layouts.

## Import

```ts
import { Sortable } from '@fex/components-react/primitive/sortable'
import { useSortable } from '@fex/components-react/hooks/use-sortable'
```

## Basic Usage

```tsx
<SortableRoot items={items} axis="y" onChange={setItems}>
  {items.map((item) => (
    <SortableItem key={item.id} id={item.id}>
      {item.label}
    </SortableItem>
  ))}
  <SortableOverlay>
    {({ activeId }) => items.find((item) => item.id === activeId)?.label}
  </SortableOverlay>
</SortableRoot>
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `string[] \| Record<string, string[]>` | - | Yes | Sortable item ids. Records enable multiple containers. |
| `axis` | `'x' \| 'y'` | `undefined` | No | Locks sorting intent to one axis. Omit for grid/free layouts. |
| `containerId` | `string` | `'default'` | No | Container id for multi-container sorting. |
| `onChange` | `(items) => void` | - | No | Called with the committed order after drop. |

## Overlay

`SortableOverlay` renders the active item as a fixed floating layer while the original item stays in the list as a transparent placeholder. This avoids text overlap and gives the same interaction shape as sortable systems that separate the dragged preview from layout.

```tsx
<SortableOverlay className="shadow-xl">
  {({ activeId }) => activeId}
</SortableOverlay>
```

When using `useSortable` directly, render your own overlay with `getOverlayStyle()` and `activeId`.

## Notes

For table columns or complex layouts, call `useSortable` directly and reuse `getMotionStyle(id)` on all DOM nodes that should animate with the same item.
