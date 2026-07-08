# Dialog Primitive

Vue Dialog mirrors the shared core Dialog controller and exposes slot props for trigger composition.

## Import

```ts
import { Dialog, DialogTrigger, DialogPortal, DialogOverlay, DialogContent } from '@fex/components-vue/primitive/dialog'
```

## Example

```vue
<Dialog>
  <DialogTrigger v-slot="{ props, ref }">
    <button v-bind="props" :ref="ref">Open</button>
  </DialogTrigger>
  <DialogPortal>
    <DialogOverlay />
    <DialogContent>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogContent>
  </DialogPortal>
</Dialog>
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | - | No | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | No | Initial uncontrolled open state. |
| `open-change` | `(open, info) => void` | - | No | Emits when user actions request a change. |
| `modal` | `boolean` | `true` | No | Marks the dialog as a modal layer. |
| `forceMount` | `boolean` | `false` | No | Keeps content mounted while closed. |
| `closeDelay` | `number` | `140` | No | Close phase duration in milliseconds. |
| `closeOnOverlayPointer` | `boolean` | `true` | No | Closes when clicking overlay. |
