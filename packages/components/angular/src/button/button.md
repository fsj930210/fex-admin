# Angular Button

## Import

```ts
import { Button } from '@fex/components-angular/button'
```

## Basic

```ts
@Component({
  standalone: true,
  imports: [Button],
  template: `<button fexButton variant="default">Save</button>`,
})
export class Example {}
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `'default' \| 'outline' \| 'secondary' \| 'ghost' \| 'destructive' \| 'link' \| 'dashed'` | `'default'` | No | Visual style. |
| `size` | `'default' \| 'xs' \| 'sm' \| 'lg' \| 'icon' \| 'icon-xs' \| 'icon-sm' \| 'icon-lg'` | `'default'` | No | Button size. |
| `effect` | `'expand-icon' \| 'ring-hover' \| 'shine' \| 'shine-hover' \| 'gooey-left' \| 'gooey-right' \| 'underline' \| 'hover-underline' \| 'gradient-slide-show'` | `undefined` | No | Optional visual effect. |
| `iconPlacement` | `'start' \| 'end'` | `'start'` | No | Projected icon position. |
| `loading` | `boolean` | `false` | No | Shows the built-in spinner and disables the button. |
| `disabled` | `boolean` | `false` | No | Disables user interaction. |

Use `slot="start"` or `slot="end"` on projected SVG icons.
