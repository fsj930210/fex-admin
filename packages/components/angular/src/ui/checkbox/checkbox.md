# Angular Checkbox

## Import

```ts
import { Checkbox, CheckboxGroupUi } from '@fex/components-angular/ui/checkbox'
```

## Usage

```html
<button fexCheckbox [checked]="checked()" (checkedChange)="checked.set($event.checked)"></button>
```

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `checked` | `boolean \| 'indeterminate'` | `undefined` | No | Controlled checked state. |
| `defaultChecked` | `boolean \| 'indeterminate'` | `false` | No | Initial unchecked state. |
| `disabled` | `boolean` | `false` | No | Disables interaction. |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | No | Visual size. |
| `checkedChange` | `{ checked, meta }` | - | No | Emits after state changes. |

Use `aria-invalid` for invalid styling. `div[fexCheckboxGroup]` is a layout wrapper and does not own a value array.
