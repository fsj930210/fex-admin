# Vue Checkbox

## Import

```ts
import { Checkbox, CheckboxGroup } from '@fex/components-vue/ui/checkbox'
```

## Usage

```vue
<Checkbox :checked="checked" @checked-change="checked = $event" />
```

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `checked` | `boolean \| 'indeterminate'` | `undefined` | No | Controlled checked state. |
| `defaultChecked` | `boolean \| 'indeterminate'` | `false` | No | Initial unchecked state. |
| `disabled` | `boolean` | `false` | No | Disables interaction. |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | No | Visual size. |
| `checked-change` | `(checked, meta) => void` | - | No | Emitted after state changes. |

Use `aria-invalid` for invalid styling. `CheckboxGroup` is a layout wrapper and does not own a value array.
