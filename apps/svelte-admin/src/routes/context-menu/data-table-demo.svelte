<script lang="ts">
  import type { ContextMenuOpenChangeInfo } from '@fex-design/core/overlay/context-menu/types'
  import ContextMenu from '@fex-design/svelte/primitive/context-menu'
  import ContextMenuContent from '@fex-design/svelte/primitive/context-menu-content'
  import ContextMenuPortal from '@fex-design/svelte/primitive/context-menu-portal'
  import ContextMenuTrigger from '@fex-design/svelte/primitive/context-menu-trigger'
  import MenuSurface from './menu-surface.svelte'

  const columns = ['Name', 'Department', 'Status', 'Progress']
  const rows = [
    ['Ada Lovelace', 'Platform', 'Active', '82%'],
    ['Grace Hopper', 'Components', 'Active', '91%'],
    ['Katherine Johnson', 'Docs', 'Paused', '64%'],
  ]
  let activePayload = $state('')
  const label = $derived(activePayload.startsWith('column:') ? 'Column actions' : 'Row actions')

  function handleOpenChange(open: boolean, info: ContextMenuOpenChangeInfo<string>) {
    if (open) activePayload = info.payload ?? ''
  }
</script>

<ContextMenu onOpenChange={handleOpenChange}>
  <div class="overflow-hidden rounded-md border border-border bg-background">
    <table class="w-full border-collapse text-sm">
      <thead class="bg-muted-background text-muted-foreground">
        <tr>
          {#each columns as column (column)}
            <ContextMenuTrigger payload={'column:' + column}>
              {#snippet children(trigger)}
                <th
                  use:trigger.action
                  {...trigger.props}
                  scope="col"
                  tabindex="0"
                  class="border-b border-border px-3 py-2 text-left font-medium outline-none hover:bg-background focus:bg-background"
                >
                  {column}
                </th>
              {/snippet}
            </ContextMenuTrigger>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each rows as row (row[0])}
          <ContextMenuTrigger payload={'row:' + row[0]}>
            {#snippet children(trigger)}
              <tr
                use:trigger.action
                {...trigger.props}
                tabindex="0"
                class="outline-none hover:bg-muted-background focus:bg-muted-background"
              >
                {#each row as cell (cell)}
                  <td class="border-b border-border px-3 py-2 last:text-right">{cell}</td>
                {/each}
              </tr>
            {/snippet}
          </ContextMenuTrigger>
        {/each}
      </tbody>
    </table>
  </div>
  <ContextMenuPortal>
    <ContextMenuContent>
      <MenuSurface {label} />
    </ContextMenuContent>
  </ContextMenuPortal>
</ContextMenu>
