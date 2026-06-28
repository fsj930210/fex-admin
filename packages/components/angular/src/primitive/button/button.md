# Angular Primitive Button

## Import

```ts
import { Button } from '@fex/components-angular/primitive/button'
```

## Basic

```ts
@Component({
  standalone: true,
  imports: [Button],
  template: `<button fex-button-primitive>Save</button>`,
})
export class Example {}
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| native button attributes | `HTMLButtonElement attributes` | `undefined` | No | Native button attributes are passed through. The primitive includes the default button foundation classes but does not expose variant, size, loading, icon, or effect props. |
