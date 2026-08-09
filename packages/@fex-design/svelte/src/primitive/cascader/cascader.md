# Cascader primitive

Cascader selects one hierarchical value path, or several paths in `multiple` mode. It composes the project Popover, Checkbox, Scrollbar and icon primitives; data access is configured only through `fieldNames`.

## Import

Use the framework package's public Cascader primitive entry. Svelte imports Root, Trigger, Content and Panel from their file-level public subpaths.

## Basic composition

```tsx
<CascaderRoot options={options} clearable>
  <CascaderTrigger />
  <CascaderContent>
    <CascaderPanel />
  </CascaderContent>
</CascaderRoot>
```

A single value is a complete path such as `['zhejiang', 'hangzhou', 'xihu']`. A multiple value is an array of complete paths.

## Root props

| Prop | Type | Description |
| --- | --- | --- |
| `options` | `readonly CascaderOption[]` | Hierarchical source data. |
| `fieldNames` | `{ value?, label?, children?, disabled?, isLeaf? }` | Declarative field mapping. |
| `value` / `defaultValue` | `CascaderValue` | Controlled or initial path value. |
| `onChange` | `(value, meta) => void` | User selection change with selected option paths. |
| `multiple` | `boolean` | Enables checkbox path selection. |
| `checkStrictly` | `boolean` | Disables parent-child check conduction. |
| `changeOnSelect` | `boolean` | Allows intermediate paths to be submitted. |
| `open` / `defaultOpen` | `boolean` | Controlled or initial popup state. |
| `onOpenChange` | `(open) => void` | Popup-state notification. |
| `expandTrigger` | `'click' | 'hover'` | How non-leaf options expand. |
| `showSearch` | `boolean` | Enables full-depth path search. |
| `filterOption` | `boolean | (keyword, path) => boolean` | Default local filter, custom filter, or `false` for remote results. |
| `onSearch` | `(keyword) => void` | Uses the same search contract as Select. |
| `loadData` | `(selectedOptions) => Promise<void>` | Loads children for an unresolved path. |
| `loading` | `boolean` | Displays the project loading icon in the trigger. |
| `clearable` | `boolean` | Enables the project clear button. |
| `disabled` | `boolean` | Disables interaction. |
| `status` | `'error' | 'warning'` | Field validation styling. |

## Parts

- `CascaderTrigger` renders the input-shaped trigger and keyboard behavior.
- `CascaderValue` renders resolved path labels and multiple tags.
- `CascaderContent` composes the Popover portal/content.
- `CascaderPanel` derives columns or full-path search results.
- `CascaderColumn` uses the project Scrollbar; it never creates a native styled scrollbar.
- `CascaderOption` exposes node state for custom option content where supported.
- `CascaderEmpty` and `CascaderLoading` provide replaceable state content where supported.

## Controlled state and async display

External `value` is authoritative. Missing options never clear it or emit `onChange`. For edit-page display, fetch a standard ancestor-preserving options tree and update `options`; labels resolve automatically. `loadData` is for interactive expansion and is separate from initial value hydration.

## Search

Local search recursively matches leaf paths at any depth and displays the complete path. Remote search passes `filterOption={false}`, listens to `onSearch`, and supplies standard Cascader trees through `options`. Request cancellation and stale-response handling belong to the caller.

## Accessibility and forms

The trigger uses combobox state, columns use listbox semantics, and options expose selected/disabled state. Connect a Field's control props to the trigger and pass `status="error"` after validation fails. Validation rules and error messages remain owned by Field/Form.

## Notes

Values must use string or number path segments. Keep sibling values unique within a parent path. Do not mutate options in place; replace affected branches after lazy loading so framework adapters can react.

