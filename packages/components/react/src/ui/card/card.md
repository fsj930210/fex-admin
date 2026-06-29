# React Card

## Purpose

Card groups related content in a bordered surface. It is intended for admin panels, component examples, forms, and compact content blocks that need a stable header/content/footer structure.

## Import

```tsx
import { Card } from '@fex/components-react/ui/card'
```

## Basic

```tsx
export function Example() {
  return (
    <Card title="Variants" description="按钮的基础视觉语义。">
      Content
    </Card>
  )
}
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `ReactNode` | `undefined` | No | Header title content. |
| `description` | `ReactNode` | `undefined` | No | Header description content. |
| `footer` | `ReactNode` | `undefined` | No | Footer content. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Quick spacing preset for the card layout. |
| `className` | `{ root?: string; header?: string; title?: string; description?: string; content?: string; footer?: string }` | `undefined` | No | Part classes merged with each card part. Set `root` to override `--card-spacing`. |
| `style` | `{ root?: CSSProperties; header?: CSSProperties; title?: CSSProperties; description?: CSSProperties; content?: CSSProperties; footer?: CSSProperties }` | `undefined` | No | Part inline styles. Set `root` to override `--card-spacing`. |
| native `div` props | `Omit<ComponentProps<'div'>, 'className' \| 'style'>` | `undefined` | No | Standard `div` attributes are passed through. |

## Events

Card primitives do not define custom callbacks. Native DOM event props such as `onClick` can be passed through when needed.

## Controlled And Uncontrolled

Card has no internal state, so it does not have controlled or uncontrolled modes.

## Notes

Use `ui/card` for the default title, description, content, and footer layout. `size` provides quick spacing presets, and spacing is controlled by `--card-spacing` on the card root for custom values.

## Common Composition

Use Card as the base surface for component demos:

```tsx
function DemoCard() {
  return (
    <Card
      title="Sizes"
      description="文本按钮和 icon-only 按钮尺寸。"
      className={{ content: 'flex flex-wrap items-center gap-space-md' }}
    >
      <button>default</button>
    </Card>
  )
}
```
