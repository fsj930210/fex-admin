# Solid InputNumber Primitive

## Purpose and import

InputNumber composes InputRoot, InputControl, InputClear, InputPrefix and InputSuffix while core owns numeric normalization.

```tsx
import { InputNumber } from '@fex-design/solid/primitive/input-number'
```

## Usage

```tsx
<InputNumber value={value()} onChange={(_, next) => setValue(next)} min={0} max={10} />
<InputNumber suffix="kg" clearable />
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value/defaultValue` | `number \| undefined` | — | Controlled value or uncontrolled initial value. |
| `min/max` | `number` | — | Range applied on blur and step. |
| `step` | `number` | `1` | Increment/decrement offset. |
| `precision` | `number` | inferred | Decimal rounding precision. |
| `parser` | `(text) => number \| undefined` | finite parser | Converts draft text. |
| `formatter` | `(value, info) => string` | string formatter | Produces display text. |
| `clearable` | `boolean` | `false` | Composes InputClear. |
| `prefix/suffix` | `JSX.Element` | icon actions | Suffix replaces the action area. |
| `disabled/readOnly/invalid/status` | Input state props | — | Forwarded to InputRoot. |
| `onChange` | `(event, value) => void` | — | Preserves the source event first. |

## Events, state and composition

Explicit `value={undefined}` is controlled empty; omit `value` and use `defaultValue` for uncontrolled state. Temporary drafts remain editable until blur. Default actions render MinusIcon and PlusIcon. Clear remains separate from suffix replacement. Form/Field owns labels, validation errors and ARIA relationships; spread FieldControl props onto InputNumber.
