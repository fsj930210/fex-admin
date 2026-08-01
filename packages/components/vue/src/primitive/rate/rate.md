# Rate

Vue Rate is a primitive rating control backed by the shared core controller. It supports exact fractional display, configurable interaction steps, pointer previews, keyboard input, controlled and uncontrolled values, and scoped-slot content.

## Import

```vue
<script setup lang="ts">
import { Rate } from '@fex/components-vue/primitive/rate'
</script>
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Rate } from '@fex/components-vue/primitive/rate'
const value = ref(4.3)
</script>

<template>
  <Rate :value="value" :step="0.1" aria-label="Rating" @value-change="value = $event" />
</template>
```

## Props

| Name           | Type                        | Default      | Required | Description                                        |
| -------------- | --------------------------- | ------------ | -------- | -------------------------------------------------- |
| `value`        | `number`                    | —            | No       | Controlled committed value.                        |
| `defaultValue` | `number`                    | `0`          | No       | Initial uncontrolled value.                        |
| `count`        | `number`                    | `5`          | No       | Number of rating items.                            |
| `step`         | `number`                    | `1`          | No       | Pointer and keyboard increment.                    |
| `disabled`     | `boolean`                   | `false`      | No       | Disables focus and interaction.                    |
| `readOnly`     | `boolean`                   | `false`      | No       | Preserves focus semantics but blocks changes.      |
| `allowClear`   | `boolean`                   | `true`       | No       | Clears when the current bucket is committed again. |
| `direction`    | `'ltr' \| 'rtl'`            | `'ltr'`      | No       | Fill, pointer and keyboard direction.              |
| `size`         | `'sm' \| 'default' \| 'lg'` | `'default'`  | No       | Item size.                                         |
| `getValueText` | `(value, count) => string`  | English text | No       | Produces `aria-valuetext`.                         |

## Events and slot

- `value-preview-change`: emits a preview value during hover/drag and `null` when the preview ends.
- `value-change`: emits a committed changed value.
- `value-commit`: emits after pointer or keyboard commit.
- Default scoped slot: receives `index`, `layer`, `fill`, `fillPercent`, `full`, `partial`, `empty`, `previewing`, `disabled`, and `readOnly`.

The slot renders twice per item for the empty and clipped filled layers, so slot rendering must remain free of side effects. `step` controls interaction only; a read-only `4.37` remains 37% filled.
