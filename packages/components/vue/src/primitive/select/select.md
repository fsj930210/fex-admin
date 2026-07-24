# Select

Vue Select primitive supports single, multiple and tags selection, local or remote search, grouping, custom slots and optional virtualization.

```ts
import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from '@fex/components-vue/primitive/select'
```

`SelectRoot` owns the shared selection and search controller. Use `showSearch` for an editable trigger; tags mode enables input automatically. Passing `filterOption` performs local filtering while every keyword still emits `search`. Without `filterOption`, update `options` from the `search` handler for remote search.

The `change` event returns the public value and metadata containing `selectedItem`, `selectedItems`, `previousSelectedValues`, and `changedValues`. `maxCount` limits selection. `SelectTrigger` exposes prefix, suffix, value, and tag slots; `SelectList` exposes option, loading, and empty slots.

## Root props

| Prop                                 | Type                                 | Description                                         |
| ------------------------------------ | ------------------------------------ | --------------------------------------------------- |
| `options`                            | `readonly SelectOption[]`            | Options, groups, disabled state, and search fields. |
| `value` / `defaultValue`             | `SelectionValue \| SelectionValue[]` | Controlled or initial selection.                    |
| `multiple`                           | `boolean`                            | Enables multiple selection.                         |
| `mode`                               | `'tags'`                             | Enables tags input behavior.                        |
| `showSearch`                         | `boolean`                            | Enables editable input.                             |
| `filterOption`                       | `SelectFilterOption`                 | Local filter function.                              |
| `open` / `defaultOpen`               | `boolean`                            | Controlled or initial popup state.                  |
| `searchValue` / `defaultSearchValue` | `string`                             | Controlled or initial keyword.                      |
| `clearable`, `loading`, `disabled`   | `boolean`                            | Common control states.                              |
| `maxCount`                           | `number`                             | Maximum selected value count.                       |
| `status`                             | `'error' \| 'warning'`               | Validation appearance.                              |
| `virtual`                            | `SelectVirtualOptions`               | Fixed-height virtual list settings.                 |

## Events and control

- `change(value, meta)` includes complete selected option objects and value diffs.
- `search(keyword)` runs in local and remote modes.
- `openChange(open)` accompanies controlled popup state.

Controlled state uses `value`, `open`, and `searchValue`; uncontrolled state uses their `default*` counterparts. The popup width follows the trigger. Override `--select-content-min-height` and `--select-content-max-height` for panel sizing. Clear and the default or custom suffix share one position.
