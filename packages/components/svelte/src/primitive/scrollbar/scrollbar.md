# Scrollbar Primitive

Import Root from `@fex/components-svelte/primitive/scrollbar` and its parts from the corresponding `scrollbar-*` exports. Bars are floating elements and do not reserve content space.

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `visibility` | `'auto' \| 'always' \| 'hidden'` | `'auto'` | No | Bar visibility policy. |
| `autoHide` | `'never' \| 'scroll' \| 'move' \| 'leave'` | `'scroll'` | No | Overlay auto-hide policy. |
| `dragScroll` | `boolean` | `true` | No | Allows Thumb dragging. |
| `clickScroll` | `false \| 'page' \| 'jump'` | `false` | No | Track click behavior; opt in to prevent accidental jumps on a thin overlay rail. |
