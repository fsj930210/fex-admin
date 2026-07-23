# Tabs primitive

Angular Tabs uses standalone directives so styled navigation behavior can attach directly to user-owned elements. Application state owns Item arrays.

## Import

```ts
import { TabsContent, TabsItem, TabsList, TabsRoot, createTabs } from '@fex/components-angular/primitive/tabs'
```

## Basic usage

```html
<div fexTabsRoot>
  <ul fexTabsList>
    <li fexTabsItem value="overview">Overview</li>
    <li fexTabsItem value="analytics" closable>Analytics</li>
  </ul>
  <section *fexTabsContent="'overview'">Overview content</section>
  <section *fexTabsContent="'analytics'">Analytics content</section>
</div>
```

Without `value` or `defaultValue`, the first enabled Item is selected. The structural Content directive creates its view on first activation and retains it while inactive.

## Inputs and outputs

| Directive | Input/output | Type | Default | Required | Description |
| --- | --- | --- | --- | --- | --- |
| TabsRoot | value | `string` | - | No | Controlled active value. |
| TabsRoot | defaultValue | `string` | First enabled Item | No | Initial uncontrolled value. |
| TabsRoot | change | `{ value, meta }` | - | No | Active value output. |
| TabsRoot | close | `TabsItemRecord` | - | No | Close request; caller removes data. |
| TabsRoot | variant | `'default' \| 'line'` | `'default'` | No | Base appearance. |
| TabsRoot | orientation | `'horizontal' \| 'vertical'` | `'horizontal'` | No | Layout and keyboard direction. |
| TabsRoot | activationMode | `'automatic' \| 'manual'` | `'automatic'` | No | Focus activation behavior. |
| TabsRoot | loop | `boolean` | `true` | No | Wrap keyboard focus. |
| TabsItem | value | `string` | - | Yes | Stable identity. |
| TabsItem | disabled | `boolean` | `false` | No | Disables selection. |
| TabsItem | closable | `boolean` | `false` | No | Enables close requests. |
| TabsContent | fexTabsContent | `string` | - | Yes | Associated Item value. |

## Close controls and composition

Angular owns the element structure, so close controls are explicit:

```html
<li fexTabsItem #tab="fexTabsItem" value="files" closable>
  Files
  <button type="button" (pointerdown)="$event.stopPropagation()" (click)="tab.requestClose($event)">Close</button>
</li>
```

Use `[value]` with `(change)` for controlled state. `createTabs` exposes the component-level controller and signal bridge for custom directives or components. Add, remove, extra actions and Sortable update caller-owned state; Tabs never mutates the array.
