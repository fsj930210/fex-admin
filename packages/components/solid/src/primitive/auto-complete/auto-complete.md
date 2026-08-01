# AutoComplete

Import from `@fex/components-solid/primitive/auto-complete`.

```tsx
<AutoCompleteRoot items={items}>
  <AutoCompleteTrigger placeholder="Search names" clearable />
  <AutoCompleteContent />
</AutoCompleteRoot>
```

AutoComplete keeps input text as its value. Suggestions are optional and selection metadata returns the complete original item. Map backend records with `fieldNames={{ key: 'id', value: 'name' }}`.

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

`value/defaultValue` and `open/defaultOpen` are the two controlled/uncontrolled contracts. `onChange`, `onSearch`, `onSelect`, `onClear`, and `onOpenChange` report explicit reasons. Active suggestion remains internal.

`onSelect` includes the complete original `selectedItem`, `selectedKey`, and `previousValue`.

## Composition and notes

Trigger composes the shared Input and forwards native input attributes, validation, clear, prefix, and suffix. Content composes Popover and accepts custom children. List and Option provide the default listbox behavior.

Arrow keys navigate, Enter accepts, Escape closes, Tab remains native, disabled items are skipped, and focus stays in the input.

Remote requests, debounce, cache, error handling, form policy, and copy remain outside the primitive.
