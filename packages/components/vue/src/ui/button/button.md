# Vue Button

## Import

```vue
<script setup lang="ts">
import Button from '@fex/components-vue/ui/button'
</script>
```

## Basic

```vue
<template>
  <Button variant="default">Save</Button>
</template>
```

## Icon And Loading

```vue
<template>
  <Button loading>Loading start</Button>
  <Button icon-placement="end">
    <template #icon>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14" /></svg>
    </template>
    Icon end
  </Button>
</template>
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `'default' \| 'outline' \| 'secondary' \| 'ghost' \| 'destructive' \| 'link' \| 'dashed'` | `'default'` | No | Visual style. |
| `size` | `'default' \| 'xs' \| 'sm' \| 'lg' \| 'icon' \| 'icon-xs' \| 'icon-sm' \| 'icon-lg'` | `'default'` | No | Button size. |
| `effect` | `'expand-icon' \| 'ring-hover' \| 'shine' \| 'shine-hover' \| 'gooey-left' \| 'gooey-right' \| 'underline' \| 'hover-underline' \| 'gradient-slide-show'` | `undefined` | No | Optional visual effect. |
| `icon-placement` | `'start' \| 'end'` | `'start'` | No | Icon or loading icon position. |
| `loading` | `boolean` | `false` | No | Shows the built-in spinner and disables the button. |
| `disabled` | `boolean` | `false` | No | Disables user interaction. |

Use the named `icon` slot for custom icons.
