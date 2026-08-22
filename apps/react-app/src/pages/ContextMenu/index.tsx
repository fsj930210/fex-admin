import { Link } from 'react-router'
import { BasicContextMenuDemo } from './basic-demo'
import { DataTableContextMenuDemo } from './data-table-demo'
import { TreeContextMenuDemo } from './tree-demo'

export function ContextMenuPage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-sm">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">ContextMenu</h1>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">Right-click primitive based on pointer virtual references. Trigger props bind to existing elements, so tree rows, table headers and custom panels keep their DOM shape.</p>
          </div>
        </header>
        <div className="space-y-space-xl">
          <BasicContextMenuDemo />
          <TreeContextMenuDemo />
          <DataTableContextMenuDemo />
        </div>
      </div>
    </main>
  )
}
