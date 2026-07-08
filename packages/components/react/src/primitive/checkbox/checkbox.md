# Primitive Checkbox

Primitive Checkbox is the self-owned low-level checkbox implementation for React. It exposes parts that UI components can style and compose.

## Import

```tsx
import {
  CheckboxRoot,
  CheckboxIndicator,
  CheckboxGroup,
} from '@fex/components-react/primitive/checkbox'
```

## Usage

```tsx
<CheckboxRoot defaultChecked>
  <CheckboxIndicator>✓</CheckboxIndicator>
</CheckboxRoot>
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `checked` | `boolean \| 'indeterminate'` | `undefined` | No | Controlled checked state. |
| `defaultChecked` | `boolean \| 'indeterminate'` | `false` | No | Initial uncontrolled checked state. |
| `disabled` | `boolean` | `false` | No | Disables the root button. |
| `onCheckedChange` | `(checked, meta) => void` | `undefined` | No | Fires after checked state changes. |
| button props | `ButtonHTMLAttributes<HTMLButtonElement>` | - | No | Root element attributes except conflicting checked props. |

## Notes

- This component is implemented inside the workspace and does not depend on an external primitive.
- UI styling belongs to `@fex/components-styles`.
- Indicator icons should come from `@fex/components-react/icon/*`.
