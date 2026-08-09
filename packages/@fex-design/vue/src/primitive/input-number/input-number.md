# Vue InputNumber Primitive

## Purpose and import

InputNumber composes the existing Input parts and adds numeric draft editing, parsing, formatting, range normalization, decimal stepping and spinbutton accessibility.

```vue
<script setup>
import { InputNumber } from '@fex-design/vue/primitive/input-number'
</script>
```

## Usage

```vue
<InputNumber :min="0" :max="100" :step="0.25" clearable @change="(event, value) => save(value)" />
<InputNumber><template #suffix>kg</template></InputNumber>
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
| `disabled/readOnly/invalid/status` | Input state props | — | Forwarded to InputRoot. |
| `class` | `string` | — | Merged on InputRoot. |

## Events, state and composition

`change(event, value)` preserves the native source event first. Explicit `:value="undefined"` is controlled empty; omit `value` and use `defaultValue` for uncontrolled state. Prefix and suffix slots are optional. A suffix replaces the complete MinusIcon/PlusIcon action area while clear remains independent. Form/Field owns labels, errors and ARIA relationships; pass FieldControl bindings and Field invalid state to InputNumber.
