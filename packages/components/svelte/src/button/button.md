# Svelte Button

## Import

```svelte
<script lang="ts">
  import Button from '@fex/components-svelte/button'
</script>
```

## Basic

```svelte
<Button variant="default">Save</Button>
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `'default' \| 'outline' \| 'secondary' \| 'ghost' \| 'destructive' \| 'link' \| 'dashed'` | `'default'` | No | Visual style. |
| `size` | `'default' \| 'xs' \| 'sm' \| 'lg' \| 'icon' \| 'icon-xs' \| 'icon-sm' \| 'icon-lg'` | `'default'` | No | Button size. |
| `effect` | `'expand-icon' \| 'ring-hover' \| 'shine' \| 'shine-hover' \| 'gooey-left' \| 'gooey-right' \| 'underline' \| 'hover-underline' \| 'gradient-slide-show'` | `undefined` | No | Optional visual effect. |
| `icon` | `Snippet` | `undefined` | No | Icon snippet rendered beside the content. |
| `iconPlacement` | `'start' \| 'end'` | `'start'` | No | Icon or loading icon position. |
| `loading` | `boolean` | `false` | No | Shows the built-in spinner and disables the button. |
| `disabled` | `boolean` | `false` | No | Disables user interaction. |
