# Select

Svelte Select provides single, multiple, and tags selection while reusing the shared core controllers.

## Import

```svelte
<script>
  import SelectRoot from '@fex/components-svelte/primitive/select'
  import SelectTrigger from '@fex/components-svelte/primitive/select-trigger'
  import SelectContent from '@fex/components-svelte/primitive/select-content'
  import SelectList from '@fex/components-svelte/primitive/select-list'
</script>
```

## Basic usage

```svelte
<SelectRoot {options} onChange={(value, meta) => save(value, meta.selectedItem)}>
  <SelectTrigger placeholder="请选择" />
  <SelectContent><SelectList /></SelectContent>
</SelectRoot>
```

Use `multiple` for multiple values. `mode="tags"` also accepts values created with Enter. `showSearch` enables an editable trigger. Passing `filterOption` performs local filtering; otherwise handle `onSearch` and replace `options` with remote results.

## Root props

| Prop                               | Type                                 | Description                                               |
| ---------------------------------- | ------------------------------------ | --------------------------------------------------------- |
| `options`                          | `readonly SelectOption[]`            | Options, group labels, disabled state, and search fields. |
| `value` / `defaultValue`           | `SelectionValue \| SelectionValue[]` | Controlled or initial selection.                          |
| `multiple`                         | `boolean`                            | Enables multiple selection.                               |
| `mode`                             | `'tags'`                             | Enables tags input behavior.                              |
| `showSearch`                       | `boolean`                            | Enables text input.                                       |
| `filterOption`                     | `SelectFilterOption`                 | Local filter function.                                    |
| `open` / `defaultOpen`             | `boolean`                            | Controlled or initial popup state.                        |
| `clearable`, `loading`, `disabled` | `boolean`                            | Common control states.                                    |
| `maxCount`                         | `number`                             | Maximum selected value count.                             |
| `status`                           | `'error' \| 'warning'`               | Validation appearance.                                    |
| `virtual`                          | `SelectVirtualOptions`               | Fixed-height virtual list settings.                       |

`SelectTrigger` accepts `placeholder`, `maxTagCount`, and `prefix`, `suffix`, and `tag` snippets. `SelectList` accepts an `option` snippet and empty/loading text. Clear and the default or custom suffix occupy the same slot.

## Callbacks and control

- `onChange(value, meta)` includes the selected option objects and value diffs.
- `onSearch(keyword)` runs in both local and remote modes.
- `onOpenChange(open)` is required when controlling `open`.

Use `defaultValue` and `defaultOpen` when external control is unnecessary. Popup width follows its trigger; override `--select-content-min-height` and `--select-content-max-height` for panel sizing.
