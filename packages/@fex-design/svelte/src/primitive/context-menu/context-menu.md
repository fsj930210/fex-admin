# ContextMenu

Svelte ContextMenu uses an action from the trigger snippet to bind the caller's existing element. The menu is positioned at the right-click coordinates through the shared core controller.

```svelte
<ContextMenu>
  <ContextMenuTrigger payload="row-1">
    {#snippet children(trigger)}
      <div use:trigger.action {...trigger.props}>Right click</div>
    {/snippet}
  </ContextMenuTrigger>
</ContextMenu>
```
