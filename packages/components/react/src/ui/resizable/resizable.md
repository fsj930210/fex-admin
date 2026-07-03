# Resizable

Resizable is a split panel layout component. It is separate from `useResize`, which is for resizing a single floating element such as a dialog.

## Import

```ts
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@fex/components-react/ui/resizable'
```

## Basic Usage

```tsx
<ResizablePanelGroup direction="horizontal" defaultLayout={[30, 70]}>
  <ResizablePanel id="sidebar" minSize={20} maxSize={45} />
  <ResizableHandle />
  <ResizablePanel id="content" minSize={40} />
</ResizablePanelGroup>
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | No | Resize direction of the panel group. |
| `layout` | `number[]` | - | No | Controlled percentage layout. |
| `defaultLayout` | `number[]` | - | No | Initial percentage layout. |
| `onLayout` | `(layout: number[]) => void` | - | No | Called when the layout changes. |
| `id` | `string` | - | Yes | Panel id. |
| `minSize` | `number` | `0` | No | Minimum panel size in percent. |
| `maxSize` | `number` | `100` | No | Maximum panel size in percent. |

## Keyboard

Focus a handle and use arrow keys to resize. Hold Shift for a larger step.

