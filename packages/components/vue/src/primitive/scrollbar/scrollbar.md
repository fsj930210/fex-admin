# Scrollbar Primitive

Import from `@fex/components-vue/primitive/scrollbar`. Compose `ScrollbarRoot`, `ScrollbarViewport`, and one or two `ScrollbarBar` components. The viewport keeps native scrolling; bars float above it.

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `visibility` | `'auto' \| 'always' \| 'hidden'` | `'auto'` | No | Bar visibility policy. |
| `autoHide` | `'never' \| 'scroll' \| 'move' \| 'leave'` | `'scroll'` | No | Overlay auto-hide policy. |
| `dragScroll` | `boolean` | `true` | No | Allows Thumb dragging. |
| `clickScroll` | `false \| 'page' \| 'jump'` | `false` | No | Track click behavior; opt in to prevent accidental jumps on a thin overlay rail. |
