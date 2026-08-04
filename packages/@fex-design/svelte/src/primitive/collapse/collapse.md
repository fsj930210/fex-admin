# Collapse

Composable disclosure panels built on the shared expansion core.

## Import

```ts
import Collapse from '@fex-design/svelte/primitive/collapse'
import CollapseItem from '@fex-design/svelte/primitive/collapse-item'
import CollapseTrigger from '@fex-design/svelte/primitive/collapse-trigger'
import CollapseContent from '@fex-design/svelte/primitive/collapse-content'
```

## Basic Usage

```svelte
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

Svelte exposes instance methods through `bind:this`: `expand`, `collapse`, `toggle`, `setExpandedKeys`, `clear`, `getExpandedKeys`, `isExpanded`, and `isDisabled`.

## Controlled And Uncontrolled

Use `defaultExpandedKeys` for local state. Use `expandedKeys` with `onChange` when route, form, or server state owns expansion.

## Custom Rendering

Use `CollapseItem` render state/actions or `CollapseTrigger` render props to place the toggle on custom UI while preserving ARIA wiring.

## Notes

Collapse is the only component family. Accordion behavior is `multiple={false}`; do not create a separate Accordion component.
