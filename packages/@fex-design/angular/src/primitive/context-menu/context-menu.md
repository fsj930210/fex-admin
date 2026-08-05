# ContextMenu

Angular ContextMenu uses `fexContextMenuTrigger` to bind the caller's existing host element and positions the menu from the right-click coordinates.

```html
<fex-context-menu>
  <div [fexContextMenuTrigger]="row.id">Right click</div>
  <fex-context-menu-portal>
    <fex-context-menu-content>
      <button fexContextMenuItem>Rename</button>
    </fex-context-menu-content>
  </fex-context-menu-portal>
</fex-context-menu>
```
