# React Card

## Purpose

Card groups related content in a bordered surface. It is intended for admin panels, component examples, forms, and compact content blocks that need a stable header/content/footer structure.

## Import

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@fex/components-react/primitive/card'
```

## Basic

```tsx
export function Example() {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle>Variants</CardTitle>
        <CardDescription>按钮的基础视觉语义。</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-space-md">
        Content
      </CardContent>
    </Card>
  )
}
```

## Props

All Card primitives accept native `div` attributes, including `className`.

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | `undefined` | No | Extra classes merged with the component defaults. |
| native `div` props | `ComponentProps<'div'>` | `undefined` | No | Standard `div` attributes are passed through. |

## Events

Card primitives do not define custom callbacks. Native DOM event props such as `onClick` can be passed through when needed.

## Controlled And Uncontrolled

Card has no internal state, so it does not have controlled or uncontrolled modes.

## Notes

Use `CardHeader`, `CardContent`, and `CardFooter` to keep spacing consistent. Add `border-b border-border` or `border-t border-border` at the composition site when a section divider is needed.

## Common Composition

Use Card as the base surface for component demos:

```tsx
function DemoCard() {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle>Sizes</CardTitle>
        <CardDescription>文本按钮和 icon-only 按钮尺寸。</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-space-md">
        <button>default</button>
      </CardContent>
    </Card>
  )
}
```
