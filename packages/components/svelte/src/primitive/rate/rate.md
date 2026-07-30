# Rate

Svelte Rate is a primitive rating control backed by the shared core controller. It supports exact fractional display, configurable interaction steps, pointer previews, keyboard input, controlled and uncontrolled values, and snippet content.

## Import and usage

```svelte
<script lang="ts">
  import Rate from '@fex/components-svelte/primitive/rate'
  let value = $state(4.3)
</script>

<Rate {value} step={0.1} aria-label="Rating" onValueChange={(next) => value = next} />
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `number` | — | No | Controlled committed value. |
| `defaultValue` | `number` | `0` | No | Initial uncontrolled value. |
| `count` | `number` | `5` | No | Number of rating items. |
| `step` | `number` | `1` | No | Pointer and keyboard increment. |
| `disabled` | `boolean` | `false` | No | Disables focus and interaction. |
| `readOnly` | `boolean` | `false` | No | Blocks value changes. |
| `allowClear` | `boolean` | `true` | No | Clears when the current bucket is committed again. |
| `direction` | `'ltr' \| 'rtl'` | `'ltr'` | No | Fill, pointer and keyboard direction. |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | No | Item size. |
| `children` | `Snippet<[RateItemRenderState]>` | Star | No | Renders empty and filled layers. |
| `onValuePreviewChange` | `(value \| null) => void` | — | No | Reports hover and drag previews. |
| `onValueChange` | `(value) => void` | — | No | Reports changed values. |
| `onValueCommit` | `(value) => void` | — | No | Reports completed commits. |

The snippet receives `index`, `layer`, `fill`, `fillPercent`, `full`, `partial`, `empty`, `previewing`, `disabled`, and `readOnly`. It renders twice per item and must be free of side effects. Exact read-only fractions are not rounded by `step`.
