# Checkbox

Checkbox is the styled React wrapper around the self-owned primitive checkbox parts.

## Import

```tsx
import { Checkbox, CheckboxGroup } from '@fex/components-react/ui/checkbox'
```

## Usage

```tsx
<Checkbox defaultChecked aria-label="Enable alerts" />
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `checked` | `boolean \| 'indeterminate'` | `undefined` | No | Controlled checked state. |
| `defaultChecked` | `boolean \| 'indeterminate'` | `false` | No | Initial unchecked state. |
| `onCheckedChange` | `(checked, meta) => void` | `undefined` | No | Fires when checked state changes. |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | No | Visual size. |
| `children` | `ReactNode` | default icon | No | Indicator content. |
| button props | `ComponentProps<typeof CheckboxRoot>` | - | No | Root attributes, including `className`, `disabled`, `aria-*`, and `data-*`. |

`CheckboxGroup` is a layout wrapper and does not own a value array.
