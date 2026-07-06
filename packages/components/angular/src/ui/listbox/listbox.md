# Listbox

Angular Listbox exposes standalone UI components backed by the shared selection core.

## Import

```ts
import { ListboxRoot, ListboxItem } from '@fex/components-angular/ui/listbox'
```

## Usage

```html
<fex-ui-listbox defaultValue="kickflip">
  <fex-ui-listbox-item value="kickflip">Kickflip</fex-ui-listbox-item>
</fex-ui-listbox>
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `SelectionValue \| SelectionValue[]` | - | No | Controlled selected value. |
| `defaultValue` | `SelectionValue \| SelectionValue[]` | - | No | Initial uncontrolled selected value. |
| `multiple` | `boolean` | `false` | No | Enables multiple selection. |
| `disabledValues` | `SelectionValue[]` | `[]` | No | Values that user actions cannot change. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | No | Layout and ARIA orientation. |

## Events

`change` emits `[valueOrValues, meta]`. Meta includes `selectedValues`, `previousSelectedValues`, and `changedValues`.

## Controlled And Uncontrolled

Use `[value]` with `(change)` for controlled usage. Use `defaultValue` for uncontrolled usage.
