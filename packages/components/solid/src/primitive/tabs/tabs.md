# Tabs primitive

Solid Tabs provides styled primitive navigation, keyboard behavior, close requests and lazy retained panels. Application state owns the Item array.

## Import

```tsx
import { TabsContent, TabsItem, TabsList, TabsRoot, createTabs } from '@fex/components-solid/primitive/tabs'
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

Without `value` or `defaultValue`, the first enabled Item is selected. Content mounts on first activation and remains mounted while inactive.

## Props

| Component | Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- | --- |
| TabsRoot | value | `string` | - | No | Controlled active value. |
| TabsRoot | defaultValue | `string` | First enabled Item | No | Initial uncontrolled value. |
| TabsRoot | onChange | `(value, meta) => void` | - | No | Active value callback. |
| TabsRoot | onClose | `(item) => void` | - | No | Close request; caller removes data. |
| TabsRoot | variant | `'default' \| 'line'` | `'default'` | No | Base appearance. |
| TabsRoot | orientation | `'horizontal' \| 'vertical'` | `'horizontal'` | No | Layout and keyboard direction. |
| TabsRoot | activationMode | `'automatic' \| 'manual'` | `'automatic'` | No | Focus activation behavior. |
| TabsRoot | loop | `boolean` | `true` | No | Wrap keyboard focus. |
| TabsItem | value | `string` | - | Yes | Stable identity. |
| TabsItem | disabled | `boolean` | `false` | No | Disables selection. |
| TabsItem | closable | `boolean` | `false` | No | Renders the icon close control. |
| TabsContent | value | `string` | - | Yes | Associated Item value. |

## Custom rendering

List, Item and Content accept a context-taking function child that returns the complete root. Spread the supplied props, including the Item ref.

```tsx
<TabsItem value="files">
  {({ props, state }) => <li {...props} data-active={state.active}>Files</li>}
</TabsItem>
```

`createTabs` exposes the component-level logic for completely custom DOM. Use controlled `value` with `onChange`, or `defaultValue`/automatic first selection for uncontrolled state. Add, remove, extra actions and Sortable update caller-owned state.
