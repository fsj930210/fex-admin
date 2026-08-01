# Drawer Primitive

Drawer is a composable side panel with four placements, optional mask, nested overlay layering, configurable preset or CSS sizes, and a resize handle backed by the shared `useResize` hook.

```tsx
import { DrawerRoot, DrawerTrigger, DrawerPortal, DrawerMask, DrawerContent, DrawerHeader, DrawerBody, DrawerClose } from '@fex/components-react/primitive/drawer'
```

`DrawerContent` accepts native ARIA attributes such as `aria-label` and `aria-labelledby`; header content is intentionally user-defined. `DrawerFooter` is optional and renders only when used. `onSizeChange` receives the current primary-axis size in pixels while dragging.

`DrawerRoot` closes when the mask itself is clicked by default. Set `closeOnMaskPointer={false}` when a flow must remain open until it is closed programmatically or through `DrawerClose`.
