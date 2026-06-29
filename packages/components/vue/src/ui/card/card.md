# Vue Card

## Purpose

Card groups related content in a bordered surface. It is used for admin panels, component examples, forms, and compact content blocks.

## Import

```vue
<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@fex/components-vue/ui/card'
</script>
```

## Basic

```vue
<template>
  <Card>
    <CardHeader class="border-b border-border">
      <CardTitle>Variants</CardTitle>
      <CardDescription>按钮的基础视觉语义。</CardDescription>
    </CardHeader>
    <CardContent class="flex flex-wrap items-center gap-space-md">
      Content
    </CardContent>
  </Card>
</template>
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `unknown` | `undefined` | No | Header title content. |
| `description` | `unknown` | `undefined` | No | Header description content. |
| `footer` | `unknown` | `undefined` | No | Footer content. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Quick spacing preset for the card layout. |
| `class` | `{ root?: string; header?: string; title?: string; description?: string; content?: string; footer?: string }` | `undefined` | No | Part classes merged with each card part. Set `root` to override `--card-spacing`. |
| `style` | `{ root?: CSSProperties; header?: CSSProperties; title?: CSSProperties; description?: CSSProperties; content?: CSSProperties; footer?: CSSProperties }` | `undefined` | No | Part inline styles. Set `root` to override `--card-spacing`. |
| native attributes | `HTMLAttributes` | `undefined` | No | Standard attributes are passed through. |

## Events

Card primitives do not define custom events. Native DOM listeners can be passed through.

## Controlled And Uncontrolled

Card has no internal state, so it does not have controlled or uncontrolled modes.

## Notes

`size` provides quick spacing presets, and spacing is controlled by `--card-spacing` on the card root for custom values.

## Common Composition

Use Card as the base surface for component demos and compact admin panels.
