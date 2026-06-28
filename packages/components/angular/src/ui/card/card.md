# Angular Card

## Purpose

Card groups related content in a bordered surface. It is used for admin panels, component examples, forms, and compact content blocks.

## Import

```ts
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@fex/components-angular/ui/card'
```

## Basic

```html
<fex-card>
  <fex-card-header class="border-b border-border">
    <fex-card-title>Variants</fex-card-title>
    <fex-card-description>按钮的基础视觉语义。</fex-card-description>
  </fex-card-header>
  <fex-card-content class="flex flex-wrap items-center gap-space-md">
    Content
  </fex-card-content>
</fex-card>
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `class` | `string` | `undefined` | No | Extra classes merged with the component defaults. |
| native attributes | `HTMLElement attributes` | `undefined` | No | Standard host attributes are passed through. |

## Events

Card primitives do not define custom outputs. Native DOM events can be used on the host element.

## Controlled And Uncontrolled

Card has no internal state, so it does not have controlled or uncontrolled modes.

## Notes

Use CardHeader, CardContent, and CardFooter to keep spacing consistent. Add dividers such as `border-b border-border` at the composition site.

## Common Composition

Use Card as the base surface for component demos and compact admin panels.
