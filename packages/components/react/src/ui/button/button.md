# React Button

## Import

```tsx
import { Button } from '@fex/components-react/ui/button'
```

## Basic

```tsx
export function Example() {
  return <Button variant="default">Save</Button>
}
```

## Loading

```tsx
export function Loading() {
  return (
    <>
      <Button loading>Loading start</Button>
      <Button loading iconPlacement="end">Loading end</Button>
    </>
  )
}
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `'default' \| 'outline' \| 'secondary' \| 'ghost' \| 'destructive' \| 'link' \| 'dashed'` | `'default'` | No | Visual style. |
| `size` | `'default' \| 'xs' \| 'sm' \| 'lg' \| 'icon' \| 'icon-xs' \| 'icon-sm' \| 'icon-lg'` | `'default'` | No | Button size. |
| `effect` | `'expand-icon' \| 'ring-hover' \| 'shine' \| 'shine-hover' \| 'gooey-left' \| 'gooey-right' \| 'underline' \| 'hover-underline' \| 'gradient-slide-show'` | `undefined` | No | Optional visual effect. `underline` effects are intended for link or outline combinations. |
| `icon` | `ReactNode` | `undefined` | No | Icon rendered beside the content. |
| `iconPlacement` | `'start' \| 'end'` | `'start'` | No | Icon or loading icon position. |
| `loading` | `boolean` | `false` | No | Shows the built-in spinner and disables the button. |
| `disabled` | `boolean` | `false` | No | Disables user interaction. |

Native button attributes are passed through.
