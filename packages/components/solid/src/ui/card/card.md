# Solid Card

## Purpose

Card groups related content in a bordered surface. It is used for admin panels, component examples, forms, and compact content blocks.

## Import

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@fex/components-solid/ui/card'
```

## Basic

```tsx
export function Example() {
  return (
    <Card>
      <CardHeader class="border-b border-border">
        <CardTitle>Variants</CardTitle>
        <CardDescription>按钮的基础视觉语义。</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-wrap items-center gap-space-md">
        Content
      </CardContent>
    </Card>
  )
}
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `class` | `string` | `undefined` | No | Extra classes merged with the component defaults. |
| native `div` props | `ComponentProps<'div'>` | `undefined` | No | Standard `div` attributes are passed through. |

## Events

Card primitives do not define custom callbacks. Native DOM event props can be passed through.

## Controlled And Uncontrolled

Card has no internal state, so it does not have controlled or uncontrolled modes.

## Notes

Use `CardHeader`, `CardContent`, and `CardFooter` to keep spacing consistent. Add dividers such as `border-b border-border` at the composition site.

## Common Composition

Use Card as the base surface for component demos and compact admin panels.
