# React InputNumber Primitive

## Purpose and import

InputNumber composes the existing Input parts and adds numeric draft editing, parsing, formatting, range normalization, decimal stepping and spinbutton accessibility.

```tsx
import { InputNumber } from '@fex-design/react/primitive/input-number'
import { useInputNumber } from '@fex-design/react/primitive/input-number/use-input-number'
```

## Usage

```tsx
<InputNumber min={0} max={100} step={0.25} precision={2} clearable />
<InputNumber suffix="kg" />
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
| `prefix/suffix` | `ReactNode` | icon actions | Suffix replaces the action area. |
| `disabled/readOnly/invalid/status` | Input state props | — | Forwarded to InputRoot. |
| `onChange` | `(event, value) => void` | — | Preserves the source event first. |

## Events, state and composition

Explicit `value={undefined}` is controlled empty; omit `value` and use `defaultValue` for uncontrolled state. Temporary drafts such as `-`, `.` and `1.` remain editable until blur. Default actions render MinusIcon and PlusIcon. Clear remains separate from suffix replacement. Form/Field owns labels, validation errors and ARIA relationships. `useInputNumber` exposes the same numeric logic for custom DOM.
