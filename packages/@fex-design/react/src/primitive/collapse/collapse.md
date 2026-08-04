# Collapse

Composable disclosure panels built on the shared expansion core.

## Import

```ts
import { Collapse, CollapseItem, CollapseTrigger, CollapseContent } from '@fex-design/react/primitive/collapse'
```

## Basic Usage

```tsx
<Collapse defaultExpandedKeys={['profile']}>
  <CollapseItem value="profile">
    <CollapseTrigger>Profile settings</CollapseTrigger>
    <CollapseContent>Panel content</CollapseContent>
  </CollapseItem>
</Collapse>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `expandedKeys` | `ExpansionKey[]` | `undefined` | Controlled expanded keys. |
| `defaultExpandedKeys` | `ExpansionKey[]` | `undefined` | Initial uncontrolled expanded keys. |
| `disabledKeys` | `ExpansionKey[]` | `undefined` | Keys that cannot be toggled. |
| `multiple` | `boolean` | `true` | Whether multiple panels may be open. Use `false` for accordion behavior. |
| `collapsible` | `boolean` | `true` | In single mode, whether the open panel may be collapsed to none. |
| `variant` | `'outlined' | 'filled' | 'ghost'` | `'outlined'` | Visual treatment. |
| `size` | `'sm' | 'md' | 'lg'` | `'md'` | Header and content spacing. |
| `onChange` | `(keys, meta) => void` | `undefined` | Fires after expansion changes. |

## Events And Methods

React exposes instance methods through `ref`: `expand`, `collapse`, `toggle`, `setExpandedKeys`, `clear`, `getExpandedKeys`, `isExpanded`, and `isDisabled`. Other framework adapters expose the same capability through their native ref/export mechanism.

## Controlled And Uncontrolled

Use `defaultExpandedKeys` for local state. Use `expandedKeys` with `onChange` when route, form, or server state owns expansion.

## Custom Rendering

Use `CollapseItem` render state/actions or `CollapseTrigger` render props to place the toggle on custom UI while preserving ARIA wiring.

## Notes

Collapse is the only component family. Accordion behavior is `multiple={false}`; do not create a separate Accordion component.

