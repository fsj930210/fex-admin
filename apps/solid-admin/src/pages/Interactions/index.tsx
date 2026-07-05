import { A } from '@solidjs/router'
import { createDraggable } from '@fex/components-solid/primitives/create-draggable'
import { createDroppable } from '@fex/components-solid/primitives/create-droppable'
import { createDropzone } from '@fex/components-solid/primitives/create-dropzone'
import { createMove } from '@fex/components-solid/primitives/create-move'
import { createResize } from '@fex/components-solid/primitives/create-resize'
import { Card } from '@fex/components-solid/ui/card'
import { For, Show, createSignal, type JSX } from 'solid-js'
import { Portal } from 'solid-js/web'

const draggableItems = {
  'status-card': { id: 'status-card', label: 'Status card', type: 'card' },
  'owner-chip': { id: 'owner-chip', label: 'Owner chip', type: 'chip' },
} as const

export function InteractionsPage() {
  const [files, setFiles] = createSignal<string[]>([])
  const [dropResult, setDropResult] = createSignal('Drop a draggable item into a zone.')
  const [dropDemoItems, setDropDemoItems] = createSignal({
    source: ['status-card', 'owner-chip'],
    'card-zone': [] as string[],
    'any-zone': [] as string[],
  })
  const dropzone = createDropzone({
    accept: ['image/*', '.txt'],
    multiple: true,
    onDropFiles: (nextFiles) => setFiles(nextFiles.map((file) => file.name)),
  })
  const move = createMove({ defaultPosition: { x: 24, y: 24 }, bounds: 'parent' })
  const resize = createResize({
    defaultRect: { x: 24, y: 24, width: 320, height: 180 },
    edges: 'all',
    minWidth: 220,
    minHeight: 120,
  })

  function reportDrop(zoneId: 'card-zone' | 'any-zone', zone: string, source: Record<string, unknown>, edge: string | null) {
    const itemId = String(source.id)
    if (!(itemId in draggableItems)) {
      return
    }
    setDropDemoItems((current) => ({
      source: current.source.filter((id) => id !== itemId),
      'card-zone': [...current['card-zone'].filter((id) => id !== itemId), ...(zoneId === 'card-zone' ? [itemId] : [])],
      'any-zone': [...current['any-zone'].filter((id) => id !== itemId), ...(zoneId === 'any-zone' ? [itemId] : [])],
    }))
    setDropResult(`${String(source.id)} dropped on ${zone}${edge ? ` at ${edge}` : ''}.`)
  }

  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-xl">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</A>
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
                <For each={dropDemoItems().source}>{(itemId) => <DraggableToken {...draggableItems[itemId as keyof typeof draggableItems]} />}</For>
                <Show when={dropDemoItems().source.length === 0}>
                  <p class="rounded-md border border-dashed border-border px-space-md py-space-sm text-sm text-muted-foreground">All items have been dropped.</p>
                </Show>
              </div>
              <div class="grid gap-space-md md:grid-cols-2">
                <DroppableZone
                  id="card-zone"
                  title="Cards only"
                  accept="card"
                  items={dropDemoItems()['card-zone']}
                  onChanged={setDropResult}
                  onDropped={(source, edge) => reportDrop('card-zone', 'Cards only', source, edge)}
                />
                <DroppableZone
                  id="any-zone"
                  title="Any item"
                  items={dropDemoItems()['any-zone']}
                  onChanged={setDropResult}
                  onDropped={(source, edge) => reportDrop('any-zone', 'Any item', source, edge)}
                />
              </div>
            </div>
            <p class="mt-space-md rounded-md bg-muted-background px-space-md py-space-sm text-sm text-muted-foreground">{dropResult()}</p>
          </Card>

          <Card title="Dropzone" description="The primitive handles drag state, validation, and hidden input selection.">
            <div
              {...dropzone.rootDataAttributes()}
              class="flex min-h-32 cursor-pointer items-center justify-center rounded-md border border-dashed border-border bg-muted-background text-sm text-muted-foreground transition-colors data-[dragging=true]:border-ring data-[dragging=true]:bg-accent-background"
              onClick={dropzone.open}
              onDragEnter={dropzone.onDragEnter}
              onDragOver={dropzone.onDragOver}
              onDragLeave={dropzone.onDragLeave}
              onDrop={dropzone.onDrop}
            >
              <input ref={dropzone.setInput} {...dropzone.inputProps} />
              <span>{files().length > 0 ? files().join(', ') : 'Drop images or text files here'}</span>
            </div>
          </Card>

          <Card title="Move" description="useMove adds draggable behavior to any existing element.">
            <div class="relative h-64 overflow-hidden rounded-md border border-border bg-background">
              <div ref={move.setTarget} class="absolute w-72 overflow-hidden rounded-md border border-border bg-card shadow-lg" style={move.style() as JSX.CSSProperties}>
                <div ref={move.setHandle} {...move.getHandleProps()} class="flex min-h-11 cursor-grab touch-none select-none items-center justify-between border-b border-border bg-muted-background px-space-md text-sm font-medium active:cursor-grabbing">
                  <span>Drag this title bar</span><span class="text-muted-foreground">::</span>
                </div>
                <p class="p-space-md text-sm text-muted-foreground">The card is constrained to its parent. The title bar is the move handle.</p>
              </div>
            </div>
          </Card>

          <Card title="Resize" description="useResize supports edge and corner handles for floating surfaces.">
            <div class="relative h-80 overflow-hidden rounded-md border border-border bg-background">
              <div ref={resize.setTarget} class="absolute rounded-md border border-border bg-card p-space-md shadow-lg" style={resize.style() as JSX.CSSProperties}>
                <p class="text-sm font-medium">Resizable surface</p>
                <p class="mt-space-sm text-sm text-muted-foreground">Drag any edge or corner. Handles are intentionally visible for this demo.</p>
                <div {...resize.getHandleProps('top')} class="absolute left-4 right-4 top-0 z-10 h-2 cursor-n-resize rounded-b bg-primary/50 hover:bg-primary" />
                <div {...resize.getHandleProps('right')} class="absolute bottom-4 right-0 top-4 z-10 w-2 cursor-e-resize rounded-l bg-primary/50 hover:bg-primary" />
                <div {...resize.getHandleProps('bottom')} class="absolute bottom-0 left-4 right-4 z-10 h-2 cursor-s-resize rounded-t bg-primary/50 hover:bg-primary" />
                <div {...resize.getHandleProps('left')} class="absolute bottom-4 left-0 top-4 z-10 w-2 cursor-w-resize rounded-r bg-primary/50 hover:bg-primary" />
                <div {...resize.getHandleProps('top-left')} class="absolute left-0 top-0 z-20 size-6 cursor-nw-resize rounded-br bg-primary shadow-sm" />
                <div {...resize.getHandleProps('top-right')} class="absolute right-0 top-0 z-20 size-6 cursor-ne-resize rounded-bl bg-primary shadow-sm" />
                <div {...resize.getHandleProps('bottom-left')} class="absolute bottom-0 left-0 z-20 size-6 cursor-sw-resize rounded-tr bg-primary shadow-sm" />
                <div {...resize.getHandleProps('bottom-right')} class="absolute bottom-0 right-0 z-20 size-6 cursor-se-resize rounded-tl bg-primary shadow-sm" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}

function DraggableToken(props: { id: string; label: string; type: string }) {
  const draggable = createDraggable({ id: props.id, type: props.type, data: { label: props.label } })
  return (
    <>
      <div
        ref={draggable.setTarget}
        data-dragging={draggable.dragging() || undefined}
        onPointerDown={draggable.onPointerDown}
        class="flex min-h-11 cursor-grab touch-none select-none items-center justify-between rounded-md border border-border bg-card px-space-md text-sm font-medium shadow-sm transition-[opacity,box-shadow] hover:shadow-md active:cursor-grabbing data-[dragging=true]:opacity-35"
      >
        <span>{props.label}</span>
        <span class="text-muted-foreground">::</span>
      </div>
      <Show when={draggable.dragging()}>
        <Portal>
          <div class="flex min-h-11 items-center justify-between rounded-md border border-border bg-card px-space-md text-sm font-medium text-foreground opacity-100 shadow-xl ring-1 ring-border/70" style={draggable.overlayStyle() as JSX.CSSProperties}>
            <span>{props.label}</span>
            <span class="text-muted-foreground">::</span>
          </div>
        </Portal>
      </Show>
    </>
  )
}

function DroppableZone(props: {
  id: string
  title: string
  accept?: string
  items: string[]
  onChanged: (message: string) => void
  onDropped: (source: Record<string, unknown>, edge: string | null) => void
}) {
  const droppable = createDroppable({
    id: props.id,
    edges: ['top', 'bottom'],
    onDragEnter: ({ source }) => props.onChanged(`${String(source.id)} is over ${props.title}.`),
    onDragLeave: () => props.onChanged('Drop a draggable item into a zone.'),
    onDrop: ({ source, edge }) => props.onDropped(source, edge),
    ...(props.accept ? { accept: props.accept } : {}),
  })

  return (
    <div
      ref={droppable.setTarget}
      {...droppable.dataAttributes()}
      class="flex min-h-36 flex-col justify-between rounded-md border border-dashed border-border bg-background p-space-md text-sm transition-colors data-[can-drop=true]:border-ring data-[over=true]:bg-accent-background"
    >
      <div>
        <p class="font-medium text-foreground">{props.title}</p>
        <p class="mt-space-sm text-muted-foreground">{droppable.over() ? (droppable.canDrop() ? 'Release to drop.' : 'This item is not accepted.') : 'Drop target'}</p>
        <div class="mt-space-md space-y-space-sm">
          <For each={props.items}>{(itemId) => <DraggableToken {...draggableItems[itemId as keyof typeof draggableItems]} />}</For>
        </div>
      </div>
      <p class="text-xs text-muted-foreground">{droppable.edge() ? `Closest edge: ${droppable.edge()}` : props.accept ? `Accepts: ${props.accept}` : 'Accepts all'}</p>
    </div>
  )
}
