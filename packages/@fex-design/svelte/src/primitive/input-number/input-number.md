# Svelte InputNumber Primitive

## Purpose and import

InputNumber composes the existing Input components and shares parsing, normalization and stepping rules from core.

```svelte
<script>
  import InputNumber from '@fex-design/svelte/primitive/input-number'
</script>
```

## Usage

```svelte
<InputNumber value={amount} onChange={(event, value) => amount = value} clearable />
<InputNumber>{#snippet suffix()}kg{/snippet}</InputNumber>
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
| `prefix/suffix` | `Snippet` | icon actions | Suffix replaces the action area. |
| `disabled/readonly/invalid/status` | Input state props | — | Forwarded to InputRoot. |
| `onChange` | `(event, value) => void` | — | Preserves the source event first. |

## Events, state and composition

Explicit `value={undefined}` is controlled empty; omit `value` and use `defaultValue` for uncontrolled state. Temporary drafts remain editable until blur. Default actions render MinusIcon and PlusIcon, and InputClear remains independent. Form/Field owns labels, validation errors and ARIA relationships; spread FieldControl binding props onto InputNumber.
