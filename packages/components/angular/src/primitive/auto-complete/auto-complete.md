# AutoComplete

Import `AutoCompleteRoot`, `AutoCompleteTrigger`, `AutoCompleteContent`, and `AutoCompleteList` from `@fex/components-angular/primitive/auto-complete`.

```html
<fex-auto-complete [items]="items">
  <fex-auto-complete-trigger placeholder="Search names" [clearable]="true" />
  <fex-auto-complete-content />
</fex-auto-complete>
```

AutoComplete preserves free text. Selecting a suggestion fills the input and emits the original item. Use `[fieldNames]="{ key: 'id', value: 'name' }"` for backend records.

## Root inputs

| Input                    | Purpose                                                                   |
| ------------------------ | ------------------------------------------------------------------------- |
| `items` / `fieldNames`   | Original records and `key`, `value`, optional `label`, `disabled` mapping |
| `value` / `defaultValue` | Controlled or initial input text                                          |
| `open` / `defaultOpen`   | Controlled or initial panel state                                         |
| `filterOption`           | Contains filter, predicate, or `false`                                    |
| `loading`                | Replaceable loading state                                                 |
| `disabled` / `readOnly`  | Shared Input states                                                       |
| `closeOnSelect` / `loop` | Closing and keyboard wrapping                                             |

## Outputs and controlled state

`value/defaultValue` and `open/defaultOpen` are controlled/uncontrolled contracts. `change`, `search`, `select`, `clear`, and `openChange` expose reason metadata. Active suggestion remains internal.

`select` includes the complete original `selectedItem`, `selectedKey`, and `previousValue`.

## Composition and notes

Trigger composes the shared Input directives and preserves validation and clear behavior. Content composes Popover and supports projected custom content. List supplies the default listbox/option semantics and an item template.

Keyboard navigation keeps focus in the input. Remote request, debounce, cache, error handling, and business validation remain outside the primitive.
