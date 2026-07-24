# Select

Solid Select provides single, multiple, and tags selection on top of the shared core selection and select controllers.

## Import

```tsx
import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-solid/primitive/select'
```

## Basic usage

```tsx
<SelectRoot options={options} onChange={(value, meta) => save(value, meta.selectedItem)}>
  <SelectTrigger placeholder="请选择" />
  <SelectContent>
    <SelectList />
  </SelectContent>
</SelectRoot>
```

Use `multiple` for multiple selection or `mode="tags"` to accept both options and values created with Enter. `showSearch` makes the trigger editable. Supplying `filterOption` enables local filtering; without it, update `options` from `onSearch` for remote search.

## Root props

| Prop                               | Type                                 | Description                                             |
| ---------------------------------- | ------------------------------------ | ------------------------------------------------------- |
| `options`                          | `readonly SelectOption[]`            | Options, groups, disabled state, and searchable fields. |
| `value` / `defaultValue`           | `SelectionValue \| SelectionValue[]` | Controlled or initial selection.                        |
| `multiple`                         | `boolean`                            | Enables multiple selection.                             |
| `mode`                             | `'tags'`                             | Enables multiple selection and Enter-created values.    |
| `showSearch`                       | `boolean`                            | Enables editable search input.                          |
| `filterOption`                     | `SelectFilterOption`                 | Local filter; omit for remote results.                  |
| `open` / `defaultOpen`             | `boolean`                            | Controlled or initial popup state.                      |
| `clearable`, `loading`, `disabled` | `boolean`                            | Common control states.                                  |
| `maxCount`                         | `number`                             | Maximum selected value count.                           |
| `status`                           | `'error' \| 'warning'`               | Form validation appearance.                             |
| `virtual`                          | `SelectVirtualOptions`               | Fixed-height virtual list settings.                     |

`SelectTrigger` accepts `placeholder`, `maxTagCount`, `prefix`, `suffix`, and `tag`. `SelectList` accepts custom `option`, `empty`, and `loading` renderers. The suffix replaces the default chevron; clear and chevron share one suffix position.

## Callbacks

- `onChange(value, meta)` returns `selectedItem`, `selectedItems`, `previousSelectedValues`, and `changedValues`.
- `onSearch(keyword)` runs for every local or remote keyword.
- `onOpenChange(open)` accompanies controlled popup state.

Control `value` and `open` only when their callbacks write the next values back. Otherwise use `defaultValue` and `defaultOpen`. Popup width follows the trigger; override `--select-content-min-height` and `--select-content-max-height` for panel sizing.
