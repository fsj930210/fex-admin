# Tabs primitive

Vue Tabs provides styled primitive navigation, keyboard behavior, close requests and lazy retained panels. Item arrays remain application state.

## Import

```ts
import { TabsContent, TabsItem, TabsList, TabsRoot, useTabs } from '@fex/components-vue/primitive/tabs'
```

## Basic usage

```vue
<TabsRoot>
  <TabsList>
    <TabsItem value="overview">Overview</TabsItem>
    <TabsItem value="analytics" closable>Analytics</TabsItem>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="analytics">Analytics content</TabsContent>
</TabsRoot>
```

Without `model-value` or `default-value`, the first enabled Item is selected. Content mounts on first activation and remains in the DOM while inactive.

## Props and events

| Component | Prop/event | Type | Default | Required | Description |
| --- | --- | --- | --- | --- | --- |
| TabsRoot | `v-model` | `string` | - | No | Controlled active value. |
| TabsRoot | default-value | `string` | First enabled Item | No | Initial uncontrolled value. |
| TabsRoot | change | `(value) => void` | - | No | Active value change event. |
| TabsRoot | close | `(item) => void` | - | No | Close request; caller removes data. |
| TabsRoot | variant | `'default' \| 'line'` | `'default'` | No | Base appearance. |
| TabsRoot | orientation | `'horizontal' \| 'vertical'` | `'horizontal'` | No | Layout and keyboard direction. |
| TabsRoot | activation-mode | `'automatic' \| 'manual'` | `'automatic'` | No | Focus activation behavior. |
| TabsRoot | loop | `boolean` | `true` | No | Wrap keyboard focus. |
| TabsItem | value | `string` | - | Yes | Stable identity. |
| TabsItem | disabled | `boolean` | `false` | No | Disables selection. |
| TabsItem | closable | `boolean` | `false` | No | Renders the icon close control. |
| TabsContent | value | `string` | - | Yes | Associated Item value. |

## Custom rendering

Use the named `#render` scoped slot to replace the complete root and bind its `props` once.

```vue
<TabsList><template #render="{ props }"><ul v-bind="props"><slot /></ul></template></TabsList>
<TabsItem value="files"><template #render="{ props, state }"><li v-bind="props" :data-active="state.active">Files</li></template></TabsItem>
```

`useTabs` is the component-level composable for completely custom DOM. Controlled state uses `v-model`; uncontrolled state uses `default-value` or automatic first selection. Add, remove, extra actions and Sortable update caller-owned state.
