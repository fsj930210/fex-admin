# Svelte Card

## Purpose

Card groups related content in a bordered surface. It is used for admin panels, component examples, forms, and compact content blocks.

## Import

```svelte
<script lang="ts">
  import Card from '@fex/components-svelte/ui/card'
  import CardContent from '@fex/components-svelte/ui/card-content'
  import CardDescription from '@fex/components-svelte/ui/card-description'
  import CardFooter from '@fex/components-svelte/ui/card-footer'
  import CardHeader from '@fex/components-svelte/ui/card-header'
  import CardTitle from '@fex/components-svelte/ui/card-title'
</script>
```

## Basic

```svelte
<Card>
  <CardHeader class="border-b border-border">
    <CardTitle>Variants</CardTitle>
    <CardDescription>按钮的基础视觉语义。</CardDescription>
  </CardHeader>
  <CardContent class="flex flex-wrap items-center gap-space-md">
    Content
  </CardContent>
</Card>
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `Snippet \| string` | `undefined` | No | Header title content. |
| `description` | `Snippet \| string` | `undefined` | No | Header description content. |
| `footer` | `Snippet \| string` | `undefined` | No | Footer content. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Quick spacing preset for the card layout. |
| `class` | `{ root?: string; header?: string; title?: string; description?: string; content?: string; footer?: string }` | `undefined` | No | Part classes merged with each card part. Set `root` to override `--card-spacing`. |
| `style` | `{ root?: string; header?: string; title?: string; description?: string; content?: string; footer?: string }` | `undefined` | No | Part inline styles. Set `root` to override `--card-spacing`. |
| native `div` props | `Omit<HTMLAttributes<HTMLDivElement>, 'class' \| 'style' \| 'title'>` | `undefined` | No | Standard `div` attributes are passed through. |

## Events

Card primitives do not define custom events. Native DOM listeners can be passed through.

## Controlled And Uncontrolled

Card has no internal state, so it does not have controlled or uncontrolled modes.

## Notes

`size` provides quick spacing presets, and spacing is controlled by `--card-spacing` on the card root for custom values.

## Common Composition

Use Card as the base surface for component demos and compact admin panels.
