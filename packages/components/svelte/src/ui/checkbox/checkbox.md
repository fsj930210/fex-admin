# Svelte Checkbox

## Import

```svelte
<script>
  import Checkbox from '@fex/components-svelte/ui/checkbox'
  import CheckboxGroup from '@fex/components-svelte/ui/checkbox-group'
</script>
```

## Usage

```svelte
<Checkbox checked={checked} onCheckedChange={(next) => (checked = next)} />
```

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `checked` | `boolean \| 'indeterminate'` | `undefined` | No | Controlled checked state. |
| `defaultChecked` | `boolean \| 'indeterminate'` | `false` | No | Initial unchecked state. |
| `disabled` | `boolean` | `false` | No | Disables interaction. |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | No | Visual size. |
| `onCheckedChange` | `(checked, meta) => void` | - | No | Fires after state changes. |

Use `aria-invalid` for invalid styling. `CheckboxGroup` is a layout wrapper and does not own a value array.
