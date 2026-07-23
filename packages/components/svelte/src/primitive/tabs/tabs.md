# Tabs primitive

Svelte Tabs provides styled primitive navigation, keyboard behavior, close requests and lazy retained panels. Item arrays remain application state.

## Import

```svelte
<script>
  import TabsRoot from '@fex/components-svelte/primitive/tabs-root'
  import TabsList from '@fex/components-svelte/primitive/tabs-list'
  import TabsItem from '@fex/components-svelte/primitive/tabs-item'
  import TabsContent from '@fex/components-svelte/primitive/tabs-content'
</script>
```

## Basic usage

```svelte
<TabsRoot>
  <TabsList>
    <TabsItem value="overview">Overview</TabsItem>
    <TabsItem value="analytics" closable>Analytics</TabsItem>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="analytics">Analytics content</TabsContent>
</TabsRoot>
```

Without `value` or `defaultValue`, the first enabled Item is selected. Content mounts lazily on first activation and remains mounted while inactive.

## Props

| Component | Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- | --- |
| TabsRoot | value | `string` | - | No | Controlled active value. |
| TabsRoot | defaultValue | `string` | First enabled Item | No | Initial uncontrolled value. |
| TabsRoot | onchange | `(value) => void` | - | No | Active value callback. |
| TabsRoot | onclose | `(item) => void` | - | No | Close request; caller removes data. |
| TabsRoot | variant | `'default' \| 'line'` | `'default'` | No | Base appearance. |
| TabsRoot | orientation | `'horizontal' \| 'vertical'` | `'horizontal'` | No | Layout and keyboard direction. |
| TabsRoot | activationMode | `'automatic' \| 'manual'` | `'automatic'` | No | Focus activation behavior. |
| TabsRoot | loop | `boolean` | `true` | No | Wrap keyboard focus. |
| TabsItem | value | `string` | - | Yes | Stable identity. |
| TabsItem | disabled | `boolean` | `false` | No | Disables selection. |
| TabsItem | closable | `boolean` | `false` | No | Renders the icon close control. |
| TabsContent | value | `string` | - | Yes | Associated Item value. |

## Custom rendering

Provide the named `render` snippet to replace a complete List, Item or Content root. Spread `props`; custom Item snippets also apply the supplied `itemRef` action.

`createTabs` is exported from `@fex/components-svelte/primitive/tabs` for completely custom structures. Controlled state uses `value` and `onchange`. Add, remove, extra actions and Sortable update caller-owned state.
