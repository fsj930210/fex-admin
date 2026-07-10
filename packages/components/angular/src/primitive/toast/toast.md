# Toast Primitive

Import from `@fex/components-angular/primitive/toast`. Use `ToastService` for command calls and mount `fex-toast-viewport` once in the page or app shell.

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `placement` | `ToastPlacement` | `'top'` | No | Viewport position. |
| `offset` | `number \| string` | `24` | No | Distance from the viewport edge. |
| `stack` | `boolean` | `false` | No | Shows stack layers when the threshold is exceeded. |
| `stackThreshold` | `number` | `3` | No | Number of items that triggers stacked display. |
| `items` | `AngularToastItem[]` | `[]` | No | Items projected into this placement viewport. Used for stack state and timer coordination. |
| `id` | `string` | generated | No | Stable identity for updating one toast instead of adding more. |

Hovering a toast pauses its timer. Stack mode only changes presentation; timer policy remains owned by the toast manager. Configure queue limits with `toast.configure({ max })` and set `duration` on individual toast commands. Unknown variants fall back to default styling and keep `data-variant` for custom CSS. Use `toast.destroy(id)` for one toast and `toast.destroy()` for all toasts.
