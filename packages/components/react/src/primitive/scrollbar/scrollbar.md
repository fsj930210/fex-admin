# Scrollbar Primitive

`@fex/components-react/primitive/scrollbar` renders custom overlay bars while the Viewport keeps browser-native scrolling.

```tsx
<ScrollbarRoot className="h-80"><ScrollbarViewport>Content</ScrollbarViewport><ScrollbarBar axis="y" /></ScrollbarRoot>
```

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `visibility` | `'auto' \| 'always' \| 'hidden'` | `'auto'` | No | Bar visibility policy. |
| `autoHide` | `'never' \| 'scroll' \| 'move' \| 'leave'` | `'scroll'` | No | Overlay auto-hide policy. |
| `dragScroll` | `boolean` | `true` | No | Allows Thumb dragging. |
| `clickScroll` | `false \| 'page' \| 'jump'` | `false` | No | Track click behavior; opt in to prevent accidental jumps on a thin overlay rail. |
| `axis` | `'x' \| 'y'` | - | Bar only | Axis represented by a Bar. |

Use one `ScrollbarBar` for one direction and two Bars plus `ScrollbarCorner` for both. Bars are absolute overlays; to start a bar below a fixed region, give that Bar a Tailwind layout class such as `top-12`.
