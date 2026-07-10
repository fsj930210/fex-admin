# Toast Primitive

Toast provides a global message primitive. The command API can be called outside React components, while `ToastViewport` renders the current manager snapshot.

## Import

```tsx
import { ToastViewport, ToastRoot, ToastTitle, ToastDescription, ToastClose, toast } from '@fex/components-react/primitive/toast'
import { CloseIcon } from '@fex/components-react/icon/close'
```

## Usage

```tsx
toast.success('Saved successfully')
toast.error({ id: 'http-401', title: 'Session expired' })

<ToastViewport offset={72}>
  {(items) => items.map((item) => (
    <ToastRoot key={item.id} toast={item}>
      <ToastTitle>{item.title}</ToastTitle>
      <ToastClose toast={item}><CloseIcon className="size-4" /></ToastClose>
      {item.description ? <ToastDescription>{item.description}</ToastDescription> : null}
    </ToastRoot>
  ))}
</ToastViewport>
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `placement` | `'top' \| 'top-left' \| 'top-right' \| 'bottom' \| 'bottom-left' \| 'bottom-right'` | `'top'` | No | Viewport position. |
| `offset` | `number \| string` | `24` | No | Distance from the viewport edge. |
| `stack` | `boolean` | `false` | No | Collapses older toast items when the threshold is exceeded. |
| `stackThreshold` | `number` | `3` | No | Number of items that triggers stacked display. |
| `id` | `string` | generated | No | Stable identity. The same id updates the existing toast instead of creating another one. |

## Notes

Use `id` for repeated global events such as HTTP 401, loading updates, and repeated button clicks. Toasts pause their auto close timer while hovered. Stack mode only changes presentation; timer policy remains owned by the toast manager. Configure queue limits with `toast.configure({ max })` and set `duration` on individual toast commands. Use `toast.destroy(id)` for one toast and `toast.destroy()` for all toasts.
