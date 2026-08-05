# ContextMenu

Solid ContextMenu exposes a render-prop trigger and uses a virtual reference based on the contextmenu pointer coordinates. It does not wrap caller DOM.

```tsx
<ContextMenu>{() => <>
  <ContextMenuTrigger payload="row-1">
    {({ ref, props }) => <div ref={ref} {...props}>Right click</div>}
  </ContextMenuTrigger>
  <ContextMenuPortal>
    <ContextMenuContent><ContextMenuItem>Rename</ContextMenuItem></ContextMenuContent>
  </ContextMenuPortal>
</>}</ContextMenu>
```

The function child is intentional: it delays trigger creation until the ContextMenu provider is active, which keeps Solid context lookup correct in dev and production builds.
