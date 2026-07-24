# Select

Angular Select is a standalone primitive composition backed by the shared core selection and select controllers.

## Import

```ts
import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-angular/primitive/select'
```

## Basic usage

```html
<fex-select [options]="options" (change)="save($event.value, $event.meta.selectedItem)">
  <fex-select-trigger placeholder="请选择" />
  <fex-select-content><fex-select-list /></fex-select-content>
</fex-select>
```

Use `[multiple]="true"` for multiple selection or `mode="tags"` for multiple selection plus Enter-created values. `[showSearch]="true"` enables input. Provide `filterOption` for local search; omit it and update `options` from `(search)` for remote search.

## SelectRoot inputs

| Input                              | Type                                 | Description                                         |
| ---------------------------------- | ------------------------------------ | --------------------------------------------------- |
| `options`                          | `readonly SelectOption[]`            | Options, groups, disabled state, and search fields. |
| `value` / `defaultValue`           | `SelectionValue \| SelectionValue[]` | Controlled or initial selection.                    |
| `multiple`                         | `boolean`                            | Enables multiple selection.                         |
| `mode`                             | `'tags'`                             | Enables tags input behavior.                        |
| `showSearch`                       | `boolean`                            | Enables editable search input.                      |
| `filterOption`                     | `SelectFilterOption`                 | Local filter function.                              |
| `open` / `defaultOpen`             | `boolean`                            | Controlled or initial popup state.                  |
| `clearable`, `loading`, `disabled` | `boolean`                            | Common control states.                              |
| `maxCount`                         | `number`                             | Maximum selected value count.                       |
| `status`                           | `'error' \| 'warning'`               | Validation appearance.                              |
| `virtual`                          | `SelectVirtualOptions`               | Fixed-height virtual list settings.                 |

`SelectTrigger` accepts `placeholder` and `maxTagCount`. Project templates named `#prefix`, `#suffix`, and `#tag` to customize those parts. `SelectList` accepts an `#option` template. The suffix replaces the default chevron and shares its position with clear.

## Outputs and control

- `(change)` emits `{ value, meta }`; metadata includes complete selected option objects and value diffs.
- `(search)` emits every keyword for local and remote workflows.
- `(openChange)` emits popup changes and must update `[open]` in controlled mode.

Prefer `defaultValue` and `defaultOpen` for uncontrolled use. Select can be placed on the public `FieldControl` in a real Form/Field validation flow. Popup width follows its trigger; override `--select-content-min-height` and `--select-content-max-height` for panel sizing.
