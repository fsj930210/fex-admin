# AutoComplete

AutoComplete combines a text input and optional suggestions. Free text is always valid; selecting an item only accepts a suggestion.

Import from `@fex/components-vue/primitive/auto-complete`.

```vue
<AutoCompleteRoot :items="items" @change="change">
  <AutoCompleteTrigger placeholder="Search names" clearable />
  <AutoCompleteContent />
</AutoCompleteRoot>
```

Backend records remain intact:

```vue
<AutoCompleteRoot
  :items="users"
  :field-names="{ key: 'id', value: 'name' }"
  @select="(_, meta) => save(meta.selectedItem)"
/>
```

## Root props and events

| Prop                     | Purpose                                                                   |
| ------------------------ | ------------------------------------------------------------------------- |
| `items` / `fieldNames`   | Original records and `key`, `value`, optional `label`, `disabled` mapping |
| `value` / `defaultValue` | Controlled or initial input text                                          |
| `open` / `defaultOpen`   | Controlled or initial panel state                                         |
| `filterOption`           | Contains filter, predicate, or `false` for remote data                    |
| `loading`                | Replaceable loading state                                                 |
| `disabled` / `readOnly`  | Shared Input states                                                       |
| `closeOnSelect` / `loop` | Closing and keyboard wrapping                                             |

| Event               | Payload                                                          |
| ------------------- | ---------------------------------------------------------------- |
| `change` / `search` | Text, reason, and previous value                                 |
| `select`            | Value, complete original `selectedItem`, key, and previous value |
| `clear`             | Previous value                                                   |
| `openChange`        | Panel state and reason                                           |

Only `value` and `open` support controlled/uncontrolled use. Active suggestion is internal and filtered items are derived.

## Composition

`AutoCompleteTrigger` uses the existing Input primitives and forwards native input attributes. It preserves validation, clear, prefix, suffix, and native ARIA labels. `AutoCompleteContent` uses Popover and accepts fully custom content. `AutoCompleteList` supplies the default listbox/option behavior and an `option` slot.

Arrow keys navigate, Enter accepts, Escape closes, and input focus remains stable. Disabled items cannot become active or selected.

Remote fetching, debounce, cancellation, cache, validation policy, and business copy remain caller responsibilities.
