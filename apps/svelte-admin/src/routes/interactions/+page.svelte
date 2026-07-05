<script lang="ts">
  import { draggableAction } from '@fex/components-svelte/actions/draggable'
  import { droppableAction } from '@fex/components-svelte/actions/droppable'
  import { dropzoneAction } from '@fex/components-svelte/actions/dropzone'
  import { moveAction } from '@fex/components-svelte/actions/move'
  import { resizeAction } from '@fex/components-svelte/actions/resize'
  import Card from '@fex/components-svelte/ui/card'

  const draggableItems = {
    'status-card': { id: 'status-card', label: 'Status card', type: 'card' },
    'owner-chip': { id: 'owner-chip', label: 'Owner chip', type: 'chip' },
  } as const

  let files: string[] = $state([])
  let dropResult = $state('Drop a draggable item into a zone.')
  let dropDemoItems = $state({
    source: ['status-card', 'owner-chip'],
    'card-zone': [] as string[],
    'any-zone': [] as string[],
  })
  let input: HTMLInputElement | null = $state(null)
  let dragOverlay = $state<{ label: string; style: Record<string, string> } | null>(null)

  function reportDrop(zoneId: 'card-zone' | 'any-zone', zone: string, source: Record<string, unknown>, edge: string | null) {
    const itemId = String(source.id)
    if (!(itemId in draggableItems)) return
    dropDemoItems = {
      source: dropDemoItems.source.filter((id) => id !== itemId),
      'card-zone': [...dropDemoItems['card-zone'].filter((id) => id !== itemId), ...(zoneId === 'card-zone' ? [itemId] : [])],
      'any-zone': [...dropDemoItems['any-zone'].filter((id) => id !== itemId), ...(zoneId === 'any-zone' ? [itemId] : [])],
    }
    dropResult = `${String(source.id)} dropped on ${zone}${edge ? ` at ${edge}` : ''}.`
  }

  function onInputChange(event: Event) {
    const target = event.currentTarget as HTMLInputElement
    files = Array.from(target.files ?? []).map((file) => file.name)
    target.value = ''
  }

  function itemById(itemId: string) {
    return draggableItems[itemId as keyof typeof draggableItems]
  }

  function styleToString(style: Record<string, string | undefined>) {
    return Object.entries(style)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}:${value}`)
      .join(';')
  }
</script>

{#snippet draggableToken(item: { id: string; label: string; type: string })}
  <div
    use:draggableAction={{
      id: item.id,
      type: item.type,
      data: { label: item.label },
      onDraggingChange: (dragging) => {
        if (!dragging) dragOverlay = null
      },
      onOverlayStyleChange: (style) => {
        dragOverlay = style.display === 'none' ? null : { label: item.label, style: style as Record<string, string> }
      },
    }}
    class="flex min-h-11 cursor-grab touch-none select-none items-center justify-between rounded-md border border-border bg-card px-space-md text-sm font-medium shadow-sm transition-[opacity,box-shadow] hover:shadow-md active:cursor-grabbing data-[dragging=true]:opacity-35"
  >
    <span>{item.label}</span>
    <span class="text-muted-foreground">::</span>
  </div>
{/snippet}

{#if dragOverlay}
  <div
    class="flex min-h-11 items-center justify-between rounded-md border border-border bg-card px-space-md text-sm font-medium text-foreground opacity-100 shadow-xl ring-1 ring-border/70"
    style={styleToString(dragOverlay.style)}
  >
    <span>{dragOverlay.label}</span>
    <span class="text-muted-foreground">::</span>
  </div>
{/if}

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-xl">
      <a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a>
      <div>
        <h1 class="text-2xl font-semibold text-foreground">Interactions</h1>
        <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
          Dropzone, movable, and 8-direction resize hooks for existing components.
        </p>
      </div>
    </header>

    <div class="space-y-space-xl">
      <Card title="Drag And Drop" description="useDraggable and useDroppable wrap shared drag-drop state for cross-component drops.">
        <div class="grid gap-space-md md:grid-cols-[280px_1fr]">
          <div class="space-y-space-sm rounded-md border border-border bg-background p-space-md">
            <p class="text-sm font-medium text-muted-foreground">Draggable items</p>
            {#each dropDemoItems.source as itemId (itemId)}
              {@render draggableToken(itemById(itemId))}
            {/each}
            {#if dropDemoItems.source.length === 0}
              <p class="rounded-md border border-dashed border-border px-space-md py-space-sm text-sm text-muted-foreground">All items have been dropped.</p>
            {/if}
          </div>
          <div class="grid gap-space-md md:grid-cols-2">
            <div
              use:droppableAction={{
                id: 'card-zone',
                accept: 'card',
                edges: ['top', 'bottom'],
                onDragEnter: ({ source }) => (dropResult = `${String(source.id)} is over Cards only.`),
                onDragLeave: () => (dropResult = 'Drop a draggable item into a zone.'),
                onDrop: ({ source, edge }) => reportDrop('card-zone', 'Cards only', source, edge),
              }}
              class="flex min-h-36 flex-col justify-between rounded-md border border-dashed border-border bg-background p-space-md text-sm transition-colors data-[can-drop=true]:border-ring data-[over=true]:bg-accent-background"
            >
              <div>
                <p class="font-medium text-foreground">Cards only</p>
                <p class="mt-space-sm text-muted-foreground">Drop target</p>
                <div class="mt-space-md space-y-space-sm">
                  {#each dropDemoItems['card-zone'] as itemId (itemId)}{@render draggableToken(itemById(itemId))}{/each}
                </div>
              </div>
              <p class="text-xs text-muted-foreground">Accepts: card</p>
            </div>
            <div
              use:droppableAction={{
                id: 'any-zone',
                edges: ['top', 'bottom'],
                onDragEnter: ({ source }) => (dropResult = `${String(source.id)} is over Any item.`),
                onDragLeave: () => (dropResult = 'Drop a draggable item into a zone.'),
                onDrop: ({ source, edge }) => reportDrop('any-zone', 'Any item', source, edge),
              }}
              class="flex min-h-36 flex-col justify-between rounded-md border border-dashed border-border bg-background p-space-md text-sm transition-colors data-[can-drop=true]:border-ring data-[over=true]:bg-accent-background"
            >
              <div>
                <p class="font-medium text-foreground">Any item</p>
                <p class="mt-space-sm text-muted-foreground">Drop target</p>
                <div class="mt-space-md space-y-space-sm">
                  {#each dropDemoItems['any-zone'] as itemId (itemId)}{@render draggableToken(itemById(itemId))}{/each}
                </div>
              </div>
              <p class="text-xs text-muted-foreground">Accepts all</p>
            </div>
          </div>
        </div>
        <p class="mt-space-md rounded-md bg-muted-background px-space-md py-space-sm text-sm text-muted-foreground">{dropResult}</p>
      </Card>

      <Card title="Dropzone" description="The action handles drag state, validation, and hidden input selection.">
        <div
          use:dropzoneAction={{ accept: ['image/*', '.txt'], multiple: true, input, onDropFiles: (nextFiles) => (files = nextFiles.map((file) => file.name)) }}
          class="flex min-h-32 cursor-pointer items-center justify-center rounded-md border border-dashed border-border bg-muted-background text-sm text-muted-foreground transition-colors data-[dragging=true]:border-ring data-[dragging=true]:bg-accent-background"
        >
          <input bind:this={input} type="file" hidden accept="image/*,.txt" multiple onchange={onInputChange} />
          <span>{files.length > 0 ? files.join(', ') : 'Drop images or text files here'}</span>
        </div>
      </Card>

      <Card title="Move" description="useMove adds draggable behavior to any existing element.">
        <div class="relative h-64 overflow-hidden rounded-md border border-border bg-background">
          <div
            use:moveAction={{ position: { x: 24, y: 24 }, bounds: 'parent' }}
            class="absolute w-72 overflow-hidden rounded-md border border-border bg-card shadow-lg"
          >
            <div class="flex min-h-11 cursor-grab touch-none select-none items-center justify-between border-b border-border bg-muted-background px-space-md text-sm font-medium active:cursor-grabbing">
              <span>Drag this title bar</span><span class="text-muted-foreground">::</span>
            </div>
            <p class="p-space-md text-sm text-muted-foreground">The card is constrained to its parent. The title bar is the move handle.</p>
          </div>
        </div>
      </Card>

      <Card title="Resize" description="useResize supports edge and corner handles for floating surfaces.">
        <div class="relative h-80 overflow-hidden rounded-md border border-border bg-background">
          <div
            use:resizeAction={{ rect: { x: 24, y: 24, width: 320, height: 180 }, edges: 'all', minWidth: 220, minHeight: 120 }}
            class="absolute rounded-md border border-border bg-card p-space-md shadow-lg"
          >
            <p class="text-sm font-medium">Resizable surface</p>
            <p class="mt-space-sm text-sm text-muted-foreground">Drag any edge or corner. Handles are intentionally visible for this demo.</p>
            <div data-resize-edge="top" class="absolute left-4 right-4 top-0 z-10 h-2 cursor-n-resize rounded-b bg-primary/50 hover:bg-primary"></div>
            <div data-resize-edge="right" class="absolute bottom-4 right-0 top-4 z-10 w-2 cursor-e-resize rounded-l bg-primary/50 hover:bg-primary"></div>
            <div data-resize-edge="bottom" class="absolute bottom-0 left-4 right-4 z-10 h-2 cursor-s-resize rounded-t bg-primary/50 hover:bg-primary"></div>
            <div data-resize-edge="left" class="absolute bottom-4 left-0 top-4 z-10 w-2 cursor-w-resize rounded-r bg-primary/50 hover:bg-primary"></div>
            <div data-resize-edge="top-left" class="absolute left-0 top-0 z-20 size-6 cursor-nw-resize rounded-br bg-primary shadow-sm"></div>
            <div data-resize-edge="top-right" class="absolute right-0 top-0 z-20 size-6 cursor-ne-resize rounded-bl bg-primary shadow-sm"></div>
            <div data-resize-edge="bottom-left" class="absolute bottom-0 left-0 z-20 size-6 cursor-sw-resize rounded-tr bg-primary shadow-sm"></div>
            <div data-resize-edge="bottom-right" class="absolute bottom-0 right-0 z-20 size-6 cursor-se-resize rounded-tl bg-primary shadow-sm"></div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</main>
