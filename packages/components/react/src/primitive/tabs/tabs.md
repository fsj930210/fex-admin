# Tabs primitive

Tabs provides composable tab navigation, keyboard focus management, close requests and lazy retained panels. This is the styled primitive layer; it does not own application item arrays.

## Import

```tsx
import { TabsContent, TabsItem, TabsList, TabsRoot, useTabs } from '@fex/components-react/primitive/tabs'
```

## Basic usage

```tsx
<TabsRoot>
  <TabsList>
    <TabsItem value="overview">Overview</TabsItem>
    <TabsItem value="analytics" closable>Analytics</TabsItem>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="analytics">Analytics content</TabsContent>
</TabsRoot>
```

Without `value` or `defaultValue`, the first enabled Item is selected. Unvisited Content is not rendered; after its first activation it remains mounted and toggles with `hidden`, preserving form and pagination state.

## Props

| Component | Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- | --- |
| TabsRoot | value | `string` | - | No | Controlled active value. |
| TabsRoot | defaultValue | `string` | First enabled Item | No | Initial uncontrolled value. |
| TabsRoot | onChange | `(value, meta) => void` | - | No | Active value change callback. |
| TabsRoot | onClose | `(item) => void` | - | No | Close request callback. It does not remove caller data. |
| TabsRoot | variant | `'default' \| 'line'` | `'default'` | No | Base List, Item and Content appearance. |
| TabsRoot | orientation | `'horizontal' \| 'vertical'` | `'horizontal'` | No | Layout and arrow-key direction. |
| TabsRoot | activationMode | `'automatic' \| 'manual'` | `'automatic'` | No | Select on focus, or require Enter/Space. |
| TabsRoot | loop | `boolean` | `true` | No | Wrap keyboard focus at list boundaries. |
| TabsItem | value | `string` | - | Yes | Stable Item identity. |
| TabsItem | disabled | `boolean` | `false` | No | Prevents pointer and keyboard selection. |
| TabsItem | closable | `boolean` | `false` | No | Renders the default icon close control. |
| TabsContent | value | `string` | - | Yes | Associates a panel with an Item. |

## Custom rendering

List, Item and Content accept a children function that returns the complete root node. Attach every supplied prop, including `ref`.

```tsx
<TabsList>{({ props }) => <ul {...props}>{items}</ul>}</TabsList>
<TabsItem value="files">
  {({ props, state, closeProps }) => (
    <li {...props} data-active={state.active}>
      Files
      {state.closable && <button {...closeProps}>Close</button>}
    </li>
  )}
</TabsItem>
```

`useTabs` exposes the same List, Item, close and Content prop builders for a completely custom component. It is component-specific and exported from this Tabs entry.

## State and composition

Use `value` with `onChange` for controlled state, or `defaultValue` for an explicit uncontrolled initial value. Handle `onClose` by updating the caller-owned array. Add buttons, extra content and the project Sortable primitive compose around Tabs; reordering only changes the caller array.

Item values must be unique within one Root. Disabled Items are skipped by Arrow, Home and End navigation.
