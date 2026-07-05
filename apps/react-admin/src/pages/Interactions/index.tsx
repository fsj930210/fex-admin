import { useDraggable } from '@fex/components-react/hooks/use-draggable'
import { useDroppable } from '@fex/components-react/hooks/use-droppable'
import { useDropzone } from '@fex/components-react/hooks/use-dropzone'
import { useMove } from '@fex/components-react/hooks/use-move'
import { useResize } from '@fex/components-react/hooks/use-resize'
import { Card } from '@fex/components-react/ui/card'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router'

const draggableItems = {
  'status-card': { id: 'status-card', label: 'Status card', type: 'card' },
  'owner-chip': { id: 'owner-chip', label: 'Owner chip', type: 'chip' },
}

export function InteractionsPage() {
  const [files, setFiles] = useState<string[]>([])
  const [dropResult, setDropResult] = useState('Drop a draggable item into a zone.')
  const [dropDemoItems, setDropDemoItems] = useState({
    source: ['status-card', 'owner-chip'],
    'card-zone': [] as string[],
    'any-zone': [] as string[],
  })
  const dropzone = useDropzone({
    accept: ['image/*', '.txt'],
    multiple: true,
    onDropFiles: (nextFiles) => setFiles(nextFiles.map((file) => file.name)),
  })
  const move = useMove({ defaultPosition: { x: 24, y: 24 }, bounds: 'parent' })
  const resize = useResize({
    defaultRect: { x: 24, y: 24, width: 320, height: 180 },
    edges: 'all',
    minWidth: 220,
    minHeight: 120,
  })
  const reportDrop = (zoneId: 'card-zone' | 'any-zone', zone: string, source: Record<string, unknown>, edge: string | null) => {
    const itemId = String(source.id)
    if (!draggableItems[itemId as keyof typeof draggableItems]) {
      return
    }
    setDropDemoItems((current) => ({
      source: current.source.filter((id) => id !== itemId),
      'card-zone': [
        ...current['card-zone'].filter((id) => id !== itemId),
        ...(zoneId === 'card-zone' ? [itemId] : []),
      ],
      'any-zone': [
        ...current['any-zone'].filter((id) => id !== itemId),
        ...(zoneId === 'any-zone' ? [itemId] : []),
      ],
    }))
    setDropResult(`${String(source.id)} dropped on ${zone}${edge ? ` at ${edge}` : ''}.`)
  }

  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-xl">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            Back home
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Interactions</h1>
            <p className="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              Dropzone, movable, and 8-direction resize hooks for existing components.
            </p>
          </div>
        </header>

        <div className="space-y-space-xl">
          <Card title="Drag And Drop" description="useDraggable and useDroppable wrap Pragmatic for cross-component drops.">
            <div className="grid gap-space-md md:grid-cols-[280px_1fr]">
              <div className="space-y-space-sm rounded-md border border-border bg-background p-space-md">
                <p className="text-sm font-medium text-muted-foreground">Draggable items</p>
                {dropDemoItems.source.map((itemId) => (
                  <DraggableToken key={itemId} {...draggableItems[itemId as keyof typeof draggableItems]} />
                ))}
                {dropDemoItems.source.length === 0 && (
                  <p className="rounded-md border border-dashed border-border px-space-md py-space-sm text-sm text-muted-foreground">
                    All items have been dropped.
                  </p>
                )}
              </div>
              <div className="grid gap-space-md md:grid-cols-2">
                <DroppableZone
                  id="card-zone"
                  title="Cards only"
                  accept="card"
                  items={dropDemoItems['card-zone']}
                  onChanged={(message) => setDropResult(message)}
                  onDropped={(source, edge) => reportDrop('card-zone', 'Cards only', source, edge)}
                />
                <DroppableZone
                  id="any-zone"
                  title="Any item"
                  items={dropDemoItems['any-zone']}
                  onChanged={(message) => setDropResult(message)}
                  onDropped={(source, edge) => reportDrop('any-zone', 'Any item', source, edge)}
                />
              </div>
            </div>
            <p className="mt-space-md rounded-md bg-muted-background px-space-md py-space-sm text-sm text-muted-foreground">
              {dropResult}
            </p>
          </Card>

          <Card title="Dropzone" description="The hook handles drag state, validation, and hidden input selection.">
            <div
              {...dropzone.getRootProps()}
              className="flex min-h-32 cursor-pointer items-center justify-center rounded-md border border-dashed border-border bg-muted-background text-sm text-muted-foreground transition-colors data-[dragging=true]:border-ring data-[dragging=true]:bg-accent-background"
            >
              <input {...dropzone.getInputProps()} />
              <span>{files.length > 0 ? files.join(', ') : 'Drop images or text files here'}</span>
            </div>
          </Card>

          <Card title="Move" description="useMove adds draggable behavior to any existing element.">
            <div className="relative h-64 overflow-hidden rounded-md border border-border bg-background">
              <div
                {...move.getTargetProps()}
                className="absolute w-72 overflow-hidden rounded-md border border-border bg-card shadow-lg"
              >
                <div
                  {...move.getHandleProps()}
                  className="flex min-h-11 cursor-grab touch-none select-none items-center justify-between border-b border-border bg-muted-background px-space-md text-sm font-medium active:cursor-grabbing"
                >
                  <span>Drag this title bar</span>
                  <span className="text-muted-foreground">::</span>
                </div>
                <p className="p-space-md text-sm text-muted-foreground">
                  The card is constrained to its parent. The title bar is the move handle.
                </p>
              </div>
            </div>
          </Card>

          <Card title="Resize" description="useResize supports edge and corner handles for floating surfaces.">
            <div className="relative h-80 overflow-hidden rounded-md border border-border bg-background">
              <div
                {...resize.getTargetProps()}
                className="absolute rounded-md border border-border bg-card p-space-md shadow-lg"
              >
                <p className="text-sm font-medium">Resizable surface</p>
                <p className="mt-space-sm text-sm text-muted-foreground">
                  Drag any edge or corner. Handles are intentionally visible for this demo.
                </p>
                <div {...resize.getHandleProps('top')} className="absolute left-4 right-4 top-0 z-10 h-2 cursor-n-resize rounded-b bg-primary/50 hover:bg-primary" />
                <div {...resize.getHandleProps('right')} className="absolute bottom-4 right-0 top-4 z-10 w-2 cursor-e-resize rounded-l bg-primary/50 hover:bg-primary" />
                <div {...resize.getHandleProps('bottom')} className="absolute bottom-0 left-4 right-4 z-10 h-2 cursor-s-resize rounded-t bg-primary/50 hover:bg-primary" />
                <div {...resize.getHandleProps('left')} className="absolute bottom-4 left-0 top-4 z-10 w-2 cursor-w-resize rounded-r bg-primary/50 hover:bg-primary" />
                <div {...resize.getHandleProps('top-left')} className="absolute left-0 top-0 z-20 size-6 cursor-nw-resize rounded-br bg-primary shadow-sm" />
                <div {...resize.getHandleProps('top-right')} className="absolute right-0 top-0 z-20 size-6 cursor-ne-resize rounded-bl bg-primary shadow-sm" />
                <div {...resize.getHandleProps('bottom-left')} className="absolute bottom-0 left-0 z-20 size-6 cursor-sw-resize rounded-tr bg-primary shadow-sm" />
                <div {...resize.getHandleProps('bottom-right')} className="absolute bottom-0 right-0 z-20 size-6 cursor-se-resize rounded-tl bg-primary shadow-sm" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}

function DraggableToken({ id, label, type }: { id: string; label: string; type: string }) {
  const draggable = useDraggable({ id, type, data: { label } })

  return (
    <>
      <div
        {...draggable.getDragProps()}
        className="flex min-h-11 cursor-grab touch-none select-none items-center justify-between rounded-md border border-border bg-card px-space-md text-sm font-medium shadow-sm transition-[opacity,box-shadow] hover:shadow-md active:cursor-grabbing data-[dragging=true]:opacity-35"
      >
        <span>{label}</span>
        <span className="text-muted-foreground">
          ::
        </span>
      </div>
      {draggable.dragging && createPortal(
        <div
          className="flex min-h-11 items-center justify-between rounded-md border border-border bg-card px-space-md text-sm font-medium text-foreground opacity-100 shadow-xl ring-1 ring-border/70"
          style={draggable.getOverlayStyle()}
        >
          <span>{label}</span>
          <span className="text-muted-foreground">::</span>
        </div>,
        document.body,
      )}
    </>
  )
}

function DroppableZone({
  id,
  title,
  accept,
  items,
  onChanged,
  onDropped,
}: {
  id: string
  title: string
  accept?: string
  items: string[]
  onChanged: (message: string) => void
  onDropped: (source: Record<string, unknown>, edge: string | null) => void
}) {
  const droppable = useDroppable({
    id,
    edges: ['top', 'bottom'],
    onDragEnter: ({ source }) => onChanged(`${String(source.id)} is over ${title}.`),
    onDragLeave: () => onChanged('Drop a draggable item into a zone.'),
    onDrop: ({ source, edge }) => onDropped(source, edge),
    ...(accept ? { accept } : {}),
  })

  return (
    <div
      {...droppable.getDropProps()}
      className="flex min-h-36 flex-col justify-between rounded-md border border-dashed border-border bg-background p-space-md text-sm transition-colors data-[can-drop=true]:border-ring data-[over=true]:bg-accent-background"
    >
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-space-sm text-muted-foreground">
          {droppable.over ? (droppable.canDrop ? 'Release to drop.' : 'This item is not accepted.') : 'Drop target'}
        </p>
        <div className="mt-space-md space-y-space-sm">
          {items.map((itemId) => {
            const item = draggableItems[itemId as keyof typeof draggableItems]

            return (
              <DraggableToken key={itemId} {...item} />
            )
          })}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {droppable.edge ? `Closest edge: ${droppable.edge}` : accept ? `Accepts: ${accept}` : 'Accepts all'}
      </p>
    </div>
  )
}
