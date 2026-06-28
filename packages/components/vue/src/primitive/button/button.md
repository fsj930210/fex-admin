# Vue Primitive Button

## Import

```vue
<script setup lang="ts">
import Button from '@fex/components-vue/primitive/button'
</script>
```

## Basic

```vue
<template>
  <Button>Save</Button>
</template>
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | No | Native button type. |
| native button attributes | `HTMLAttributes` | `undefined` | No | Native button attributes are passed through. The primitive includes the default button foundation classes but does not expose variant, size, loading, icon, or effect props. |
