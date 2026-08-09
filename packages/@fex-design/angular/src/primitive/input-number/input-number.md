# Angular InputNumber Primitive

## Purpose and import

The standalone primitive composes InputRoot, InputControl, InputClear and InputSuffix while core owns numeric normalization.

```ts
import { InputNumber, InputNumberSuffix, type InputNumberChange } from '@fex-design/angular/primitive/input-number'
```

## Usage

```html
<fex-input-number [value]="amount" [min]="0" [max]="10" (change)="amount = $event.value" />
<fex-input-number><span fexInputNumberSuffix>kg</span></fex-input-number>
```

## Inputs

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `value/defaultValue` | `number \| undefined` | — | Controlled value or uncontrolled initial value. |
| `min/max` | `number` | — | Range applied on blur and step. |
| `step` | `number` | `1` | Increment/decrement offset. |
| `precision` | `number` | inferred | Decimal rounding precision. |
| `parser` | `InputNumberParser` | finite parser | Converts draft text. |
| `formatter` | `InputNumberFormatter` | string formatter | Produces display text. |
| `clearable` | `boolean` | `false` | Composes InputClear. |
| `disabled/readOnly/invalid/status` | Input state inputs | — | Forwarded to InputRoot. |
| `class` | `string` | — | Merged on InputRoot. |

## Output, state and composition

`change` emits `{ event, value }`, preserving the framework-native source event and parameter-order semantics. Binding `[value]="undefined"` is controlled empty; omit `value` and use `defaultValue` for uncontrolled state. Projected `fexInputNumberSuffix` content replaces the complete MinusIcon/PlusIcon action area while clear remains separate. Form/Field owns labels, errors and validation state; pass its invalid state to InputNumber.
