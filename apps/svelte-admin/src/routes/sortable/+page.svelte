<script lang="ts">
  import { SortableHandle, SortableItem, SortableOverlay, SortableRoot } from '@fex/components-svelte/primitive/sortable'
  import { createSortableAction } from '@fex/components-svelte/actions/sortable'
  import Card from '@fex/components-svelte/ui/card'

  const initialTasks = ['Backlog', 'Design', 'Build', 'Review']
  let tasks = $state(initialTasks)
  const initialPanels = { source: ['Name', 'Role', 'Email'], target: ['Status', 'Created at'] }
  let panels = $state(initialPanels)
  const panelSortable = createSortableAction<typeof initialPanels>({
    items: initialPanels,
    onChange: (items) => (panels = items),
    onSnapshot: (nextSnapshot) => (panelSnapshot = nextSnapshot),
  })
  let panelSnapshot = $state(panelSortable.controller.getSnapshot())
  const previewPanels = $derived.by(() => {
    void panelSnapshot.motionVersion
    return panelSortable.getPreviewItems()
  })
  const initialColumns = ['name', 'role', 'email', 'status']
  let columns = $state(initialColumns)
  const columnSortable = createSortableAction<string[]>({
    items: initialColumns,
    axis: 'x',
    onChange: (items) => (columns = items),
    onSnapshot: (nextSnapshot) => (columnSnapshot = nextSnapshot),
  })
  let columnSnapshot = $state(columnSortable.controller.getSnapshot())
  const previewColumns = $derived.by(() => {
    void columnSnapshot.motionVersion
    return columnSortable.getPreviewItems()
  })
  const rows = [
    { name: 'Alice Johnson', role: 'Engineer', email: 'alice@example.com', status: 'Active' },
    { name: 'Bob Smith', role: 'Designer', email: 'bob@example.com', status: 'Active' },
    { name: 'Charlie Brown', role: 'Manager', email: 'charlie@example.com', status: 'Away' },
  ]
  type ColumnKey = keyof (typeof rows)[number]
  const columnLabels: Record<string, string> = { name: 'Name', role: 'Role', email: 'Email', status: 'Status' }

  function styleToString(style: object) {
    return (Object.entries(style) as Array<[string, string | number | undefined]>)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}:${value}`)
      .join(';')
  }

  function panelContainer(node: HTMLElement, containerId: string) {
    return panelSortable.container(node, containerId)
  }

  function panelItem(node: HTMLElement, options: { id: string; containerId: string }) {
    return panelSortable.item(node, options)
  }

  function columnContainer(node: HTMLElement) {
    return columnSortable.container(node)
  }

  function columnItem(node: HTMLElement, id: string) {
    return columnSortable.item(node, { id })
  }

  function asArrayItems(items: string[] | Record<string, string[]>) {
    return Array.isArray(items) ? items : []
  }
</script>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-xl">
      <a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a>
      <div>
        <h1 class="text-2xl font-semibold text-foreground">Sortable</h1>
        <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
          Quick sortable components for common lists, plus useSortable for table columns and other custom layouts.
        </p>
      </div>
    </header>

    <div class="space-y-space-xl">
      <Card title="Sortable Component" description="Use the primitive component for common one-container lists.">
        <SortableRoot items={tasks} axis="y" onChange={(items) => (tasks = items as string[])}>
          {#snippet children({ items })}
            {#each asArrayItems(items) as task (task)}
              <SortableItem id={task}>
                <SortableHandle class="grid size-7 place-items-center rounded-md bg-muted-background text-muted-foreground">::</SortableHandle>
              {task}
              </SortableItem>
            {/each}
            <SortableOverlay class="flex min-h-12 items-center gap-space-sm px-space-md text-sm font-medium">
              {#snippet children({ activeId })}
                <span class="grid size-7 place-items-center rounded-md bg-muted-background text-muted-foreground">::</span>
                {activeId}
              {/snippet}
            </SortableOverlay>
          {/snippet}
        </SortableRoot>
      </Card>

      <Card title="Multiple Containers" description="The same sortable hook supports transfer panels.">
        <div class="grid gap-space-md md:grid-cols-2">
          {#each Object.entries(previewPanels) as [containerId, items] (containerId)}
            <div use:panelContainer={containerId} class="min-h-56 rounded-md border border-border bg-background p-space-md">
              <h2 class="mb-space-md text-sm font-medium capitalize text-muted-foreground">{containerId}</h2>
              {#each items as item (item)}
                <div use:panelItem={{ id: item, containerId }} class="mb-space-sm flex min-h-11 cursor-grab touch-none select-none items-center gap-space-sm rounded-md border border-border bg-card px-space-md text-sm font-medium shadow-sm transition-[transform,box-shadow,background-color,opacity] hover:bg-muted-background hover:shadow-md active:cursor-grabbing" style={styleToString((panelSnapshot.motionVersion, panelSortable.getItemStyle(item)))}>
                  <span class="grid size-7 place-items-center rounded-md bg-muted-background text-muted-foreground">::</span>
                  {item}
                </div>
              {/each}
            </div>
          {/each}
        </div>
        {#if panelSnapshot.activeId}
          <div data-sortable-overlay="" class="flex min-h-11 items-center gap-space-sm rounded-md border border-border bg-card px-space-md text-sm font-medium text-foreground opacity-100 shadow-xl ring-1 ring-border/70" style={styleToString((panelSnapshot.motionVersion, panelSortable.getOverlayStyle()))}>
            <span class="grid size-7 place-items-center rounded-md bg-muted-background text-muted-foreground">::</span>
            {panelSnapshot.activeId}
          </div>
        {/if}
      </Card>

      <Card title="Table Columns" description="useSortable can share motion styles across header and body cells.">
        <div class="overflow-hidden rounded-md border border-border bg-background">
          <table class="w-full table-fixed border-collapse text-sm">
            <thead use:columnContainer><tr>{#each previewColumns as column (column)}<th use:columnItem={column} class="cursor-grab touch-none select-none border-b border-border bg-card px-space-md py-space-md text-left font-medium text-muted-foreground transition-[transform,background-color,box-shadow,opacity] hover:bg-muted-background active:cursor-grabbing" style={styleToString((columnSnapshot.motionVersion, columnSortable.getItemStyle(column)))}><span class="inline-flex items-center gap-space-sm"><span class="text-muted-foreground">::</span>{columnLabels[column]}</span></th>{/each}</tr></thead>
            <tbody>{#each rows as row (row.email)}<tr class="border-b border-border last:border-0">{#each previewColumns as column (column)}<td class="px-space-md py-space-sm" style={styleToString((columnSnapshot.motionVersion, { ...columnSortable.getMotionStyle(column), visibility: columnSnapshot.activeId === column ? 'hidden' : undefined }))}>{row[column as ColumnKey]}</td>{/each}</tr>{/each}</tbody>
          </table>
        </div>
        {#if columnSnapshot.activeId}
          <div data-sortable-overlay="" class="overflow-hidden rounded-md border border-border bg-card text-sm text-foreground opacity-100 shadow-xl ring-1 ring-border/70" style={styleToString((columnSnapshot.motionVersion, { ...columnSortable.getOverlayStyle(), height: 'auto' }))}>
            <div class="flex min-h-12 items-center gap-space-sm border-b border-border px-space-md font-medium text-muted-foreground">
              <span>::</span>{columnLabels[columnSnapshot.activeId]}
            </div>
            {#each rows as row (row.email)}
              <div class="border-b border-border px-space-md py-space-sm last:border-0">{row[columnSnapshot.activeId as ColumnKey]}</div>
            {/each}
          </div>
        {/if}
      </Card>
    </div>
  </div>
</main>
