# Listbox

Vue Listbox uses the shared selection core and exposes `ListboxRoot`, `ListboxGroup`, `ListboxGroupLabel`, `ListboxItem`, and `ListboxItemIndicator`.

## Import

```ts
import { ListboxRoot, ListboxItem } from '@fex/components-vue/ui/listbox'
```

## Usage

```vue
<ListboxRoot :items="options" default-value="kickflip" @change="onChange">
  <ListboxItem v-for="option in options" :key="option.value" :value="option.value" :title="option.title" />
</ListboxRoot>
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `unknown[]` | `[]` | No | Items used for selected item metadata. |
| `value` | `string \| number \| Array<string \| number>` | - | No | Controlled selected value. |
| `defaultValue` | `string \| number \| Array<string \| number>` | - | No | Initial uncontrolled value. |
| `multiple` | `boolean` | `false` | No | Enables multiple selection. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | No | Layout orientation. |
| `disabled` | `boolean` | `false` | No | Disables all values. |

## Events

`change` emits the selected value or values plus metadata containing selected items and changed values.

## Controlled And Uncontrolled

Pass `value` and listen to `change` for controlled usage. Pass `defaultValue` for uncontrolled usage.
