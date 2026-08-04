# AutoComplete

AutoComplete augments a text input with optional suggestions. The input text remains the form value, so callers may submit text without selecting an item.

## Import

```tsx
import {
  AutoCompleteContent,
  AutoCompleteList,
  AutoCompleteOption,
  AutoCompleteRoot,
  AutoCompleteTrigger,
} from '@fex-design/react/primitive/auto-complete'
```

## Basic usage

```tsx
<AutoCompleteRoot items={items}>
  <AutoCompleteTrigger placeholder="Search names" clearable />
  <AutoCompleteContent />
</AutoCompleteRoot>
```

Use `fieldNames` when backend fields differ from `key`, `value`, `label`, and `disabled`. `selectedItem` in change/select metadata is always the original item.

```tsx
<AutoCompleteRoot
  items={users}
  fieldNames={{ key: 'id', value: 'name' }}
  onSelect={(_, meta) => save(meta.selectedItem)}
/>
```

## Root props

| Prop                     | Type                                | Description                              |
| ------------------------ | ----------------------------------- | ---------------------------------------- |
| `items`                  | `readonly TItem[]`                  | Suggestion source                        |
| `fieldNames`             | `{ key, value, label?, disabled? }` | Backend field mapping                    |
| `value` / `defaultValue` | `string`                            | Controlled or initial input text         |
| `onChange`               | `(value, meta) => void`             | Input, selection, and clear changes      |
| `onSearch`               | `(keyword, meta) => void`           | Input and clear search notification      |
| `onSelect`               | `(value, meta) => void`             | Accepted suggestion with original item   |
| `open` / `defaultOpen`   | `boolean`                           | Controlled or initial panel state        |
| `onOpenChange`           | `(open, meta) => void`              | Panel state request                      |
| `filterOption`           | `boolean \| function`               | Local filtering; `false` for remote data |
| `loading`                | `boolean`                           | External request state                   |

`value` and `open` are the only controllable states. Active suggestion is internal; visible items are derived.

## Events

`onChange` metadata has `reason: 'input' | 'select' | 'clear'` and `previousValue`. Selection additionally includes `selectedItem` and `selectedKey`.

Selection fills the input and normally closes the panel. It does not fire `onSearch`; free typing and clear do.

## Customization

Trigger input props are forwarded to the native input. `className`, validation status, clear, prefix, and suffix use the existing Input primitives. Content props are forwarded to Popover content. Supply children to replace the default list, or render items with `AutoCompleteList.renderItem`.

User class/style/ref are merged. Component-owned combobox/listbox roles, IDs, active descendant relations, and keyboard behavior remain authoritative.

## Accessibility and keyboard

Focus stays in the input. Arrow keys move the active suggestion, Enter accepts it, Escape closes the panel, and Tab keeps native behavior. Items use listbox/option semantics and disabled items are skipped.

## Notes

- Remote requests, debounce, cancellation, cache, and error policy belong to the caller.
- Form validation styles come from Input; error copy and descriptions come from Field/Form.
- Empty and loading presentations use the shared components by default and may be replaced through Content.
