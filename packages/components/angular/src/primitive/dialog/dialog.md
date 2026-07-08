# Dialog Primitive

Angular Dialog adapts the shared Dialog core controller through standalone components and button directives.

## Import

```ts
import { Dialog, DialogTrigger, DialogContent } from '@fex/components-angular/primitive/dialog'
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | - | No | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | No | Initial uncontrolled open state. |
| `openChange` | `EventEmitter<boolean>` | - | No | Emits when user actions request a change. |
| `modal` | `boolean` | `true` | No | Marks the dialog as a modal layer. |
| `forceMount` | `boolean` | `false` | No | Keeps content mounted while closed. |
| `closeDelay` | `number` | `140` | No | Close phase duration in milliseconds. |
| `closeOnOverlayPointer` | `boolean` | `true` | No | Closes when clicking overlay. |
