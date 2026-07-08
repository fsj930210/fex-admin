# Solid Checkbox

## Import

```tsx
import { Checkbox, CheckboxGroup } from '@fex/components-solid/ui/checkbox'
```

## Usage

```tsx
<Checkbox checked={checked()} onCheckedChange={setChecked} />
```

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `checked` | `boolean \| 'indeterminate'` | `undefined` | No | Controlled checked state. |
| `defaultChecked` | `boolean \| 'indeterminate'` | `false` | No | Initial unchecked state. |
| `disabled` | `boolean` | `false` | No | Disables interaction. |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | No | Visual size. |
| `onCheckedChange` | `(checked, meta) => void` | - | No | Fires after state changes. |

Use `aria-invalid` for invalid styling. `CheckboxGroup` is a layout wrapper and does not own a value array.
