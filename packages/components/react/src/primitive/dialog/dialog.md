# Dialog Primitive

Dialog provides a shared primitive for modal content. The core controller owns open state, presence phase, and dismiss semantics; the React adapter owns DOM, portal, refs, ARIA attributes, and classes.

## Import

```tsx
import { Dialog } from '@fex/components-react/primitive/dialog'
```

## Example

```tsx
<DialogRoot>
  <DialogTrigger>{(props) => <button {...props}>Open</button>}</DialogTrigger>
  <DialogPortal>
    <DialogOverlay />
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm action</DialogTitle>
        <DialogDescription>This action needs a decision.</DialogDescription>
      </DialogHeader>
      <DialogBody>Dialog body</DialogBody>
      <DialogFooter>
        <DialogClose>Close</DialogClose>
      </DialogFooter>
    </DialogContent>
  </DialogPortal>
</DialogRoot>
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | - | No | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | No | Initial uncontrolled open state. |
| `onOpenChange` | `(open, info) => void` | - | No | Called when user actions request an open state change. |
| `modal` | `boolean` | `true` | No | Marks the dialog as a modal layer. |
| `forceMount` | `boolean` | `false` | No | Keeps portal/content mounted while closed. |
| `closeDelay` | `number` | `140` | No | Close phase duration in milliseconds. |
| `closeOnOverlayPointer` | `boolean` | `true` | No | Closes when the overlay surface is clicked. |

## Notes

Trigger exposes render props instead of `asChild`. Consumers can attach the returned props to their own button while the adapter keeps ARIA and event behavior consistent.
