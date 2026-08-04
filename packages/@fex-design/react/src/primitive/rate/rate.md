# Rate

`Rate` is a rating primitive for whole numbers and arbitrary fractional values. Its framework-neutral controller owns value normalization, preview state and step-based interaction; the React adapter owns DOM measurement, pointer events, keyboard bindings and rendering.

## Import

```tsx
import { Rate } from '@fex-design/react/primitive/rate'
```

## Basic usage

```tsx
import { Rate } from '@fex-design/react/primitive/rate'

export function Example() {
  return <Rate defaultValue={3} aria-label="Rating" />
}
```

## Fractional interaction

`step` controls pointer and keyboard precision. Display values are only clamped to the valid range, so read-only service values retain their exact fraction.

```tsx
import { Rate } from '@fex-design/react/primitive/rate'
import { useState } from 'react'

export function FractionExample() {
  const [value, setValue] = useState(4.3)

  return <Rate value={value} step={0.1} aria-label="Product rating" onValueChange={setValue} />
}
```

## Custom content

The render function runs once for the empty layer and once for the clipped filled layer. Keep it free of side effects.

```tsx
import { Rate, type RateItemRenderState } from '@fex-design/react/primitive/rate'

function renderHeart({ layer }: RateItemRenderState) {
  return (
    <HeartIcon
      className={
        layer === 'filled' ? 'fill-danger text-danger' : 'fill-transparent text-muted-foreground'
      }
    />
  )
}

export function CustomRate() {
  return (
    <Rate defaultValue={3.6} step={0.1} aria-label="Favorite rating">
      {renderHeart}
    </Rate>
  )
}
```

## Props

| Name                   | Type                        | Default            | Required | Description                                                                |
| ---------------------- | --------------------------- | ------------------ | -------- | -------------------------------------------------------------------------- |
| `value`                | `number`                    | —                  | No       | Controlled committed value.                                                |
| `defaultValue`         | `number`                    | `0`                | No       | Initial uncontrolled value.                                                |
| `count`                | `number`                    | `5`                | No       | Number of rendered rating items.                                           |
| `step`                 | `number`                    | `1`                | No       | Pointer and keyboard interaction increment.                                |
| `disabled`             | `boolean`                   | `false`            | No       | Disables focus and value changes.                                          |
| `readOnly`             | `boolean`                   | `false`            | No       | Keeps slider semantics while preventing value changes.                     |
| `allowClear`           | `boolean`                   | `true`             | No       | Clears the value when the committed item region matches the current value. |
| `direction`            | `'ltr' \| 'rtl'`            | `'ltr'`            | No       | Controls pointer, keyboard and fill direction.                             |
| `size`                 | `'sm' \| 'default' \| 'lg'` | `'default'`        | No       | Sets the default item size and gap.                                        |
| `getValueText`         | `(value, count) => string`  | English value text | No       | Produces `aria-valuetext`.                                                 |
| `children`             | `(state) => ReactNode`      | Star               | No       | Renders the empty and filled content layers.                               |
| `onValuePreviewChange` | `(value \| null) => void`   | —                  | No       | Reports hover and drag previews; `null` restores the committed value.      |
| `onValueChange`        | `(value) => void`           | —                  | No       | Runs when a pointer or keyboard interaction changes the value.             |
| `onValueCommit`        | `(value) => void`           | —                  | No       | Runs when an interaction is committed.                                     |

Native `div` attributes are forwarded except attributes whose meaning conflicts with Rate.

## Render state

`children` receives `index`, `layer`, `fill`, `fillPercent`, `full`, `partial`, `empty`, `previewing`, `disabled` and `readOnly`. `fill` is always between `0` and `1`.

## Controlled and uncontrolled usage

Use `value` with `onValueChange` for controlled state. Use `defaultValue` when Rate should retain its own committed value. Hover and pointer-drag previews are transient in both modes and never replace a controlled value.

## Keyboard

- Arrow keys change by one `step`; horizontal arrows follow `direction`.
- `PageUp` and `PageDown` change by ten steps.
- `Home` selects `0`.
- `End` selects `count`.

## Notes

- `step` controls interaction, not display rounding. `<Rate value={4.37} readOnly />` displays 37% of the fifth item.
- Rate uses one `role="slider"` rather than generating a radio for every fractional step.
- Custom content is rendered in two visual layers and clipped with `clip-path`; avoid duplicate DOM IDs inside custom SVG content.
- Use stable, finite positive values for `count` and `step`. Invalid values fall back to `5` and `1`.
