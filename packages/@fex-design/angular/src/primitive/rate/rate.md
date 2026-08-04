# Rate

Angular Rate is a standalone, Signal-first primitive backed by the shared core controller. The host element owns slider semantics, pointer and keyboard events, while custom content uses a typed `TemplateRef` context.

## Import and usage

```ts
import { Rate } from '@fex-design/angular/primitive/rate'

@Component({
  standalone: true,
  imports: [Rate],
  template: `<fex-rate [value]="4.3" [step]="0.1" aria-label="Rating" />`,
})
export class Example {}
```

## Inputs

| Name           | Type                        | Default      | Required | Description                                        |
| -------------- | --------------------------- | ------------ | -------- | -------------------------------------------------- |
| `value`        | `number`                    | —            | No       | Controlled committed value.                        |
| `defaultValue` | `number`                    | `0`          | No       | Initial uncontrolled value.                        |
| `count`        | `number`                    | `5`          | No       | Number of rating items.                            |
| `step`         | `number`                    | `1`          | No       | Pointer and keyboard increment.                    |
| `disabled`     | `boolean`                   | `false`      | No       | Disables focus and interaction.                    |
| `readOnly`     | `boolean`                   | `false`      | No       | Blocks value changes.                              |
| `allowClear`   | `boolean`                   | `true`       | No       | Clears when the current bucket is committed again. |
| `direction`    | `'ltr' \| 'rtl'`            | `'ltr'`      | No       | Fill, pointer and keyboard direction.              |
| `size`         | `'sm' \| 'default' \| 'lg'` | `'default'`  | No       | Item size.                                         |
| `content`      | `TemplateRef`               | Star         | No       | Renders empty and filled layers.                   |
| `getValueText` | `(value, count) => string`  | English text | No       | Produces `aria-valuetext`.                         |

## Outputs

- `valuePreviewChange`: emits hover/drag previews and `null` when preview ends.
- `valueChange`: emits changed values.
- `valueCommit`: emits completed pointer and keyboard commits.

The custom template receives the render state as its implicit context. It renders twice per item and must be free of side effects. Arrow keys use `step`; Home and End select the boundaries. Exact read-only fractions are not rounded by `step`.
