# Scrollbar Primitive

Import from `@fex/components-solid/primitive/scrollbar`. `ScrollbarViewport` is native `overflow:auto`; `ScrollbarBar` is an overlay track and Thumb.

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `visibility` | `'auto' \| 'always' \| 'hidden'` | `'auto'` | No | Bar visibility policy. |
| `autoHide` | `'never' \| 'scroll' \| 'move' \| 'leave'` | `'scroll'` | No | Overlay auto-hide policy. |
| `dragScroll` | `boolean` | `true` | No | Allows Thumb dragging. |
| `clickScroll` | `false \| 'page' \| 'jump'` | `false` | No | Track click behavior; opt in to prevent accidental jumps on a thin overlay rail. |
