import { useSortable } from '@fex/components-react/hooks/use-sortable'
import { Card } from '@fex/components-react/ui/card'
import { cn } from '@fex/utils'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router'

const initialTasks = ['Backlog', 'Design', 'Build', 'Review']

const initialPanels = {
  source: ['Name', 'Role', 'Email'],
  target: ['Status', 'Created at'],
}

const initialColumns = ['name', 'role', 'email', 'status']

const rows = [
  { name: 'Alice Johnson', role: 'Engineer', email: 'alice@example.com', status: 'Active' },
  { name: 'Bob Smith', role: 'Designer', email: 'bob@example.com', status: 'Active' },
  { name: 'Charlie Brown', role: 'Manager', email: 'charlie@example.com', status: 'Away' },
]

const columnLabels: Record<string, string> = {
  name: 'Name',
  role: 'Role',
  email: 'Email',
  status: 'Status',
}

export function SortablePage() {
  const [tasks, setTasks] = useState(initialTasks)
  const [panels, setPanels] = useState(initialPanels)
  const [columns, setColumns] = useState(initialColumns)
  const listSortable = useSortable({ items: tasks, axis: 'y', onChange: setTasks })
  const panelSortable = useSortable({ items: panels, onChange: setPanels })
  const tableSortable = useSortable({ items: columns, axis: 'x', onChange: setColumns })
  const previewTasks = listSortable.previewItems as string[]
  const previewPanels = panelSortable.previewItems as typeof panels
  const previewColumns = tableSortable.previewItems as string[]

  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-xl">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            Back home
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Sortable</h1>
            <p className="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              Quick sortable components for common lists, plus useSortable for table columns and
              other custom layouts.
            </p>
          </div>
        </header>

        <div className="space-y-space-xl">
          <Card title="List" description="Drag any row. Items swap while you move, not only after drop.">
            <div {...listSortable.getContainerProps()} className="space-y-space-sm">
              {previewTasks.map((task) => (
                <div
                  key={task}
                  {...listSortable.getItemProps(task)}
                  className={cn(
                    'flex min-h-12 cursor-grab touch-none select-none items-center gap-space-sm rounded-md border border-border bg-card px-space-md text-sm font-medium shadow-sm transition-[transform,box-shadow,background-color,opacity] hover:bg-muted-background hover:shadow-md active:cursor-grabbing',
                    listSortable.activeId === task && 'shadow-lg',
                  )}
                >
                  <span className="grid size-7 place-items-center rounded-md bg-muted-background text-muted-foreground">
                    ::
                  </span>
                  {task}
                </div>
              ))}
            </div>
            {typeof listSortable.activeId === 'string' && previewTasks.includes(listSortable.activeId) && createPortal(
              <div
                data-sortable-overlay=""
                className="flex min-h-12 items-center gap-space-sm rounded-md border border-border bg-card px-space-md text-sm font-medium text-foreground opacity-100 shadow-xl ring-1 ring-border/70"
                style={listSortable.getOverlayStyle()}
              >
                <span className="grid size-7 place-items-center rounded-md bg-muted-background text-muted-foreground">
                  ::
                </span>
                {listSortable.activeId}
              </div>,
              document.body,
            )}
          </Card>

          <Card title="Multiple Containers" description="The same sortable hook supports transfer panels.">
            <div className="grid gap-space-md md:grid-cols-2">
              {Object.entries(previewPanels).map(([containerId, items]) => (
                <div
                  key={containerId}
                  {...panelSortable.getContainerProps(containerId)}
                  className="min-h-56 rounded-md border border-border bg-background p-space-md"
                >
                  <h2 className="mb-space-md text-sm font-medium capitalize text-muted-foreground">
                    {containerId}
                  </h2>
                  {items.map((item) => (
                    <div
                      key={item}
                      {...panelSortable.getItemProps(item, containerId)}
                      className={cn(
                        'mb-space-sm flex min-h-11 cursor-grab touch-none select-none items-center gap-space-sm rounded-md border border-border bg-card px-space-md text-sm font-medium shadow-sm transition-[transform,box-shadow,background-color,opacity] hover:bg-muted-background hover:shadow-md active:cursor-grabbing',
                        panelSortable.activeId === item && 'shadow-lg',
                      )}
                    >
                      <span className="grid size-7 place-items-center rounded-md bg-muted-background text-muted-foreground">
                        ::
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {typeof panelSortable.activeId === 'string' && createPortal(
              <div
                data-sortable-overlay=""
                className="flex min-h-11 items-center gap-space-sm rounded-md border border-border bg-card px-space-md text-sm font-medium text-foreground opacity-100 shadow-xl ring-1 ring-border/70"
                style={panelSortable.getOverlayStyle()}
              >
                <span className="grid size-7 place-items-center rounded-md bg-muted-background text-muted-foreground">
                  ::
                </span>
                {panelSortable.activeId}
              </div>,
              document.body,
            )}
          </Card>

          <Card title="Table Columns" description="useSortable can share motion styles across header and body cells.">
            <div {...tableSortable.getContainerProps()} className="overflow-hidden rounded-md border border-border bg-background">
              <table className="w-full table-fixed border-collapse text-sm">
                <thead>
                  <tr>
                    {previewColumns.map((column) => (
                      <th
                        key={column}
                        {...tableSortable.getItemProps(column)}
                        className={cn(
                          'cursor-grab touch-none select-none border-b border-border bg-card px-space-md py-space-md text-left font-medium text-muted-foreground transition-[transform,background-color,box-shadow,opacity] hover:bg-muted-background active:cursor-grabbing',
                          tableSortable.activeId === column && 'shadow-lg',
                        )}
                      >
                        <span className="inline-flex items-center gap-space-sm">
                          <span className="text-muted-foreground">::</span>
                          {columnLabels[column]}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.email} className="border-b border-border last:border-0">
                      {previewColumns.map((column) => (
                        <td
                          key={column}
                          className="px-space-md py-space-sm"
                          style={{
                            ...tableSortable.getMotionStyle(column),
                            visibility: tableSortable.activeId === column ? 'hidden' : undefined,
                          }}
                          ref={(element) => tableSortable.registerMotionTarget(column, element)}
                        >
                          {row[column as keyof typeof row]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {typeof tableSortable.activeId === 'string' && createPortal(
              <div
                data-sortable-overlay=""
                className="overflow-hidden rounded-md border border-border bg-card text-sm text-foreground opacity-100 shadow-xl ring-1 ring-border/70"
                style={{
                  ...tableSortable.getOverlayStyle(),
                  height: 'auto',
                }}
              >
                <div className="flex min-h-12 items-center gap-space-sm border-b border-border px-space-md font-medium text-muted-foreground">
                  <span>::</span>
                  {columnLabels[tableSortable.activeId]}
                </div>
                {rows.map((row) => (
                  <div key={row.email} className="border-b border-border px-space-md py-space-sm last:border-0">
                    {row[tableSortable.activeId as keyof typeof row]}
                  </div>
                ))}
              </div>,
              document.body,
            )}
          </Card>
        </div>
      </div>
    </main>
  )
}
