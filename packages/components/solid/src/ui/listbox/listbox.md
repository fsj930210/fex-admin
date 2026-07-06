# Listbox

Solid Listbox uses the shared selection core with fine-grained rendering through a Solid primitive adapter.

## Import

```tsx
import { ListboxRoot, ListboxItem } from '@fex/components-solid/ui/listbox'
```

## Usage

```tsx
<ListboxRoot items={options} defaultValue="kickflip" onChange={(value, meta) => console.log(value, meta.selectedItems)}>
  <For each={options}>{(option) => <ListboxItem value={option.value} title={option.title} />}</For>
</ListboxRoot>
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `TItem[]` | `[]` | No | Items used for selected item metadata. |
| `value` | `SelectionValue \| SelectionValue[]` | - | No | Controlled selected value. |
| `defaultValue` | `SelectionValue \| SelectionValue[]` | - | No | Initial uncontrolled value. |
| `multiple` | `boolean` | `false` | No | Enables multiple selection. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | No | Layout orientation. |
| `onChange` | `(valueOrValues, meta) => void` | - | No | Selection change callback. |

## Events

`onChange` returns a single value in single mode and an array in multiple mode.

## Controlled And Uncontrolled

Use `value` with `onChange` for controlled usage. Use `defaultValue` for uncontrolled usage.
