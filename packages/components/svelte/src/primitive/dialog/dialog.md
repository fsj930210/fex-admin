# Dialog Primitive

Svelte Dialog adapts the shared Dialog core controller through Svelte stores and snippets.

## Import

```svelte
<script>
  import Dialog from '@fex/components-svelte/primitive/dialog'
  import DialogTrigger from '@fex/components-svelte/primitive/dialog-trigger'
</script>
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | - | No | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | No | Initial uncontrolled open state. |
| `onOpenChange` | `(open, info) => void` | - | No | Called when user actions request a change. |
| `modal` | `boolean` | `true` | No | Marks the dialog as a modal layer. |
| `forceMount` | `boolean` | `false` | No | Keeps content mounted while closed. |
| `closeDelay` | `number` | `140` | No | Close phase duration in milliseconds. |
| `closeOnOverlayPointer` | `boolean` | `true` | No | Closes when clicking overlay. |
