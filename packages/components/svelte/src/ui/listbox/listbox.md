# Listbox

Svelte Listbox exposes separate component files for root, group, label, item, and indicator.

## Import

```svelte
<script lang="ts">
  import Listbox from '@fex/components-svelte/ui/listbox'
  import ListboxItem from '@fex/components-svelte/ui/listbox-item'
</script>
```

## Usage

```svelte
<Listbox items={options} defaultValue="kickflip" onChange={(value, meta) => console.log(value, meta.selectedItems)}>
  {#each options as option (option.value)}
    <ListboxItem value={option.value} title={option.title} />
  {/each}
</Listbox>
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `unknown[]` | `[]` | No | Items used for selected item metadata. |
| `value` | `SelectionValue \| SelectionValue[]` | - | No | Controlled selected value. |
| `defaultValue` | `SelectionValue \| SelectionValue[]` | - | No | Initial uncontrolled value. |
| `multiple` | `boolean` | `false` | No | Enables multiple selection. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | No | Layout orientation. |
| `onChange` | `(valueOrValues, meta) => void` | - | No | Selection change callback. |

## Events

`onChange` returns selected values and selected item metadata.

## Controlled And Uncontrolled

Use `value` with `onChange` for controlled usage. Use `defaultValue` for uncontrolled usage.
