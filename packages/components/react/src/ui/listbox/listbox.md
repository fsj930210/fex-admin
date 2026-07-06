# Listbox

Listbox renders keyboard-selectable option lists for single or multiple selection. It uses `@fex/components-core/selection` for controlled and uncontrolled selection state.

## Import

```tsx
import { ListboxRoot, ListboxItem } from '@fex/components-react/ui/listbox'
```

## Usage

```tsx
const options = [{ value: 'kickflip', title: 'Kickflip' }]

<ListboxRoot items={options} defaultValue="kickflip" onChange={(value, meta) => console.log(value, meta.selectedItems)}>
  {options.map((option) => (
    <ListboxItem key={option.value} value={option.value} title={option.title} />
  ))}
</ListboxRoot>
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `TItem[]` | `[]` | No | Items used to map selected values back to `selectedItems`. |
| `value` | `SelectionValue \| SelectionValue[]` | - | No | Controlled selected value. |
| `defaultValue` | `SelectionValue \| SelectionValue[]` | - | No | Initial uncontrolled selected value. |
| `multiple` | `boolean` | `false` | No | Enables multiple selection. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | No | Layout and ARIA orientation. |
| `disabled` | `boolean` | `false` | No | Disables all items from user changes. |
| `onChange` | `(valueOrValues, meta) => void` | - | No | Fires when selected values change. |

## Events

`onChange` receives a single value in single mode and an array in multiple mode. Meta includes `selectedItem`, `selectedItems`, `selectedValues`, `previousSelectedValues`, and `changedValues`.

## Controlled And Uncontrolled

Use `value` with `onChange` for controlled usage. Use `defaultValue` for uncontrolled usage.

## Notes

Use `ListboxGroup`, `ListboxGroupLabel`, `ListboxItem`, and `ListboxItemIndicator` for grouped layouts and custom item structure.
