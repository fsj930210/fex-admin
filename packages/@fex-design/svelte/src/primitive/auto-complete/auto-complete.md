# AutoComplete

Import Root, Trigger, Content, and List from their public primitive subpaths.

```svelte
<AutoCompleteRoot {items}>
  <AutoCompleteTrigger placeholder="Search names" clearable />
  <AutoCompleteContent />
</AutoCompleteRoot>
```

Input text is the form value and suggestions are optional. Use `fieldNames={{ key: 'id', value: 'name' }}` for backend records; selection metadata returns the original item with all fields.

## Root props

| Prop                     | Purpose                                                                   |
| ------------------------ | ------------------------------------------------------------------------- |
| `items` / `fieldNames`   | Original records and `key`, `value`, optional `label`, `disabled` mapping |
| `value` / `defaultValue` | Controlled or initial input text                                          |
| `open` / `defaultOpen`   | Controlled or initial panel state                                         |
| `filterOption`           | Contains filter, predicate, or `false`                                    |
| `loading`                | Replaceable loading state                                                 |
| `disabled` / `readOnly`  | Shared Input states                                                       |
| `closeOnSelect` / `loop` | Closing and keyboard wrapping                                             |

## Events and controlled state

`value/defaultValue` and `open/defaultOpen` provide controlled/uncontrolled contracts. Change, search, select, clear, and open callbacks include reasons and previous values. Active suggestion is internal.

Selection includes the complete original `selectedItem`, `selectedKey`, and `previousValue`.

## Composition and notes

Trigger reuses Input, including validation and clear behavior. Native input attributes are forwarded. Content reuses Popover and accepts arbitrary children. List provides default listbox/option rendering through its item snippet.

Arrow keys navigate, Enter accepts, Escape closes, disabled suggestions are skipped, and focus remains in the input. Remote request policy and form validation policy stay in the caller.
