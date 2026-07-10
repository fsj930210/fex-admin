import { A } from '@solidjs/router'
import { createSortable } from '@fex/components-solid/primitives/create-sortable'
import * as Sortable from '@fex/components-solid/primitive/sortable'
import { Card } from '@fex/components-solid/ui/card'
import { For, Show, createSignal, type JSX } from 'solid-js'
import { Portal } from 'solid-js/web'

const initialTasks = ['Backlog', 'Design', 'Build', 'Review']
const initialPanels = { source: ['Name', 'Role', 'Email'], target: ['Status', 'Created at'] }
const initialColumns = ['name', 'role', 'email', 'status']
const rows = [
  { name: 'Alice Johnson', role: 'Engineer', email: 'alice@example.com', status: 'Active' },
  { name: 'Bob Smith', role: 'Designer', email: 'bob@example.com', status: 'Active' },
  { name: 'Charlie Brown', role: 'Manager', email: 'charlie@example.com', status: 'Away' },
]
const columnLabels: Record<string, string> = { name: 'Name', role: 'Role', email: 'Email', status: 'Status' }

export function SortablePage() {
  const [tasks, setTasks] = createSignal(initialTasks)
  const [panels, setPanels] = createSignal(initialPanels)
  const [columns, setColumns] = createSignal(initialColumns)
  const panelSortable = createSortable({ items: panels(), onChange: setPanels })
  const tableSortable = createSortable({ items: columns(), axis: 'x', onChange: setColumns })
  const panelItems = () => panelSortable.snapshot().dragging ? panelSortable.previewItems() as typeof initialPanels : panels()
  const tableColumns = () => tableSortable.snapshot().dragging ? tableSortable.previewItems() as string[] : columns()
  function startPanelSort(event: PointerEvent, item: string, containerId: string) {
    panelSortable.update({ items: panels(), onChange: setPanels })
    panelSortable.onPointerDown(event, item, containerId)
  }
  function startTableSort(event: PointerEvent, column: string) {
    tableSortable.update({ items: columns(), axis: 'x', onChange: setColumns })
    tableSortable.onPointerDown(event, column)
  }

  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-xl">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</A>
          <div>
            <h1 class="text-2xl font-semibold text-foreground">Sortable</h1>
            <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">Quick sortable components for common lists, plus useSortable for table columns and other custom layouts.</p>
          </div>
        </header>
        <div class="space-y-space-xl">
          <Card title="Sortable Component" description="Use the primitive component for common one-container lists.">
            <Sortable.SortableRoot items={tasks()} axis="y" onChange={setTasks}>
              {({ items }) => (
                <>
                  <For each={items}>
                    {(task) => (
                      <Sortable.SortableItem id={task} class="flex min-h-12 cursor-grab touch-none select-none items-center gap-space-sm rounded-md border border-border bg-card px-space-md text-sm font-medium shadow-sm transition-[transform,box-shadow,background-color,opacity] hover:bg-muted-background hover:shadow-md active:cursor-grabbing data-[active]:shadow-lg">
                        <Sortable.SortableHandle class="grid size-7 place-items-center rounded-md bg-muted-background text-muted-foreground">::</Sortable.SortableHandle>{task}
                      </Sortable.SortableItem>
                    )}
                  </For>
                  <Sortable.SortableOverlay>
                    {(activeId) => <div class="flex min-h-12 items-center gap-space-sm"><span class="grid size-7 place-items-center rounded-md bg-muted-background text-muted-foreground">::</span>{activeId}</div>}
                  </Sortable.SortableOverlay>
                </>
              )}
            </Sortable.SortableRoot>
          </Card>
          <Card title="Multiple Containers" description="The same sortable hook supports transfer panels.">
            <div class="grid gap-space-md md:grid-cols-2">
              <For each={Object.entries(panelItems())}>
                {([containerId, items]) => (
                  <div ref={panelSortable.setContainer(containerId)} class="min-h-56 rounded-md border border-border bg-background p-space-md">
                    <h2 class="mb-space-md text-sm font-medium capitalize text-muted-foreground">{containerId}</h2>
                    <For each={items}>{(item) => <div data-sortable-id={item} ref={panelSortable.setItem(item, containerId)} onPointerDown={(event) => startPanelSort(event, item, containerId)} style={panelSortable.getItemStyle(item) as JSX.CSSProperties} class="mb-space-sm flex min-h-11 cursor-grab touch-none select-none items-center gap-space-sm rounded-md border border-border bg-card px-space-md text-sm font-medium shadow-sm transition-[transform,box-shadow,background-color,opacity] hover:bg-muted-background hover:shadow-md active:cursor-grabbing"><span class="grid size-7 place-items-center rounded-md bg-muted-background text-muted-foreground">::</span>{item}</div>}</For>
                  </div>
                )}
              </For>
            </div>
            <Show when={typeof panelSortable.snapshot().activeId === 'string'}>
              <Portal><div data-sortable-overlay="" class="flex min-h-11 items-center gap-space-sm rounded-md border border-border bg-card px-space-md text-sm font-medium text-foreground opacity-100 shadow-xl ring-1 ring-border/70" style={panelSortable.getOverlayStyle() as JSX.CSSProperties}><span class="grid size-7 place-items-center rounded-md bg-muted-background text-muted-foreground">::</span>{panelSortable.snapshot().activeId}</div></Portal>
            </Show>
          </Card>
          <Card title="Table Columns" description="useSortable can share motion styles across header and body cells.">
            <div ref={tableSortable.setContainer()} class="overflow-hidden rounded-md border border-border bg-background">
              <table class="w-full table-fixed border-collapse text-sm"><thead><tr>
                <For each={tableColumns()}>{(column) => <th data-sortable-id={column} ref={tableSortable.setItem(column)} onPointerDown={(event) => startTableSort(event, column)} style={tableSortable.getItemStyle(column) as JSX.CSSProperties} class="cursor-grab touch-none select-none border-b border-border bg-card px-space-md py-space-md text-left font-medium text-muted-foreground transition-[transform,background-color,box-shadow,opacity] hover:bg-muted-background active:cursor-grabbing"><span class="inline-flex items-center gap-space-sm"><span class="text-muted-foreground">::</span>{columnLabels[column]}</span></th>}</For>
              </tr></thead><tbody>
                <For each={rows}>{(row) => <tr class="border-b border-border last:border-0"><For each={tableColumns()}>{(column) => <td class="px-space-md py-space-sm" style={{ ...tableSortable.getMotionStyle(column), visibility: tableSortable.snapshot().activeId === column ? 'hidden' : undefined } as JSX.CSSProperties}>{row[column as keyof typeof row]}</td>}</For></tr>}</For>
              </tbody></table>
            </div>
            <Show when={typeof tableSortable.snapshot().activeId === 'string'}>
              <Portal>
                <div data-sortable-overlay="" class="overflow-hidden rounded-md border border-border bg-card text-sm text-foreground opacity-100 shadow-xl ring-1 ring-border/70" style={{ ...tableSortable.getOverlayStyle(), height: 'auto' } as JSX.CSSProperties}>
                  <div class="flex min-h-12 items-center gap-space-sm border-b border-border px-space-md font-medium text-muted-foreground">
                    <span>::</span>
                    {columnLabels[tableSortable.snapshot().activeId as string]}
                  </div>
                  <For each={rows}>
                    {(row) => <div class="border-b border-border px-space-md py-space-sm last:border-0">{row[tableSortable.snapshot().activeId as keyof typeof row]}</div>}
                  </For>
                </div>
              </Portal>
            </Show>
          </Card>
        </div>
      </div>
    </main>
  )
}
