<script lang="ts">
  import type { ContextMenuOpenChangeInfo } from '@fex-design/core/overlay/context-menu/types'
  import ContextMenu from '@fex-design/svelte/primitive/context-menu'
  import ContextMenuContent from '@fex-design/svelte/primitive/context-menu-content'
  import ContextMenuPortal from '@fex-design/svelte/primitive/context-menu-portal'
  import ContextMenuTrigger from '@fex-design/svelte/primitive/context-menu-trigger'
  import MenuSurface from './menu-surface.svelte'

  let last = $state('Right click the panel')

  function handleOpenChange(open: boolean, info: ContextMenuOpenChangeInfo<string>) {
    if (!open) return
    last = 'Opened ' + info.payload + ' at ' + Math.round(info.clientX ?? 0) + ', ' + Math.round(info.clientY ?? 0)
  }
</script>

<ContextMenu onOpenChange={handleOpenChange}>
  <ContextMenuTrigger payload="basic-panel">
    {#snippet children(trigger)}
      <div
        use:trigger.action
        {...trigger.props}
        tabindex="0"
        class="rounded-md border border-dashed border-border bg-background p-space-xl text-sm text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
      >
        {last}
      </div>
    {/snippet}
  </ContextMenuTrigger>
  <ContextMenuPortal>
    <ContextMenuContent>
      <MenuSurface label="Panel actions" />
    </ContextMenuContent>
  </ContextMenuPortal>
</ContextMenu>
