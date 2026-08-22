<script lang="ts">
  import ContextMenu from '@fex-design/svelte/primitive/context-menu'
  import ContextMenuContent from '@fex-design/svelte/primitive/context-menu-content'
  import ContextMenuPortal from '@fex-design/svelte/primitive/context-menu-portal'
  import ContextMenuTrigger from '@fex-design/svelte/primitive/context-menu-trigger'
  import MenuSurface from './menu-surface.svelte'

  const nodes = [
    { id: 'company', name: 'Fex Design', level: 0 },
    { id: 'platform', name: 'Platform team', level: 1 },
    { id: 'components', name: 'Components team', level: 1 },
    { id: 'docs', name: 'Docs team', level: 1 },
  ]
</script>

<ContextMenu>
  <div role="tree" class="max-w-md rounded-md border border-border bg-background p-1">
    {#each nodes as node (node.id)}
      <ContextMenuTrigger payload={node.id}>
        {#snippet children(trigger)}
          <div
            use:trigger.action
            {...trigger.props}
            role="treeitem"
            tabindex="0"
            aria-level={node.level + 1}
            class="flex h-8 items-center rounded-md px-2 text-sm outline-none hover:bg-muted-background focus:bg-muted-background"
            style={'padding-left:' + (8 + node.level * 20) + 'px'}
          >
            {node.name}
          </div>
        {/snippet}
      </ContextMenuTrigger>
    {/each}
  </div>
  <ContextMenuPortal>
    <ContextMenuContent>
      <MenuSurface label="Tree node actions" />
    </ContextMenuContent>
  </ContextMenuPortal>
</ContextMenu>
