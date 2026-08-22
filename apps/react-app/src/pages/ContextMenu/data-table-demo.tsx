import { ContextMenuContent, ContextMenuPortal, ContextMenuRoot, ContextMenuTrigger, useContextMenu } from '@fex-design/react/primitive/context-menu'
import { Card } from '@fex-design/react/ui/card'
import { ContextMenuSurface } from './menu-surface'

const columns = ['Name', 'Department', 'Status', 'Progress']
const rows = [
  ['Ada Lovelace', 'Platform', 'Active', '82%'],
  ['Grace Hopper', 'Components', 'Active', '91%'],
  ['Katherine Johnson', 'Docs', 'Paused', '64%'],
]

function DataTableMenuContent() {
  const { snapshot } = useContextMenu<string>('DataTableMenuContent')
  return <ContextMenuSurface label={snapshot.target?.payload?.startsWith('column:') ? 'Column actions' : 'Row actions'} />
}

export function DataTableContextMenuDemo() {
  return (
    <Card title="Data table header and row menus" description="The same ContextMenuRoot can serve many targets: header cells pass column payloads; rows pass row payloads.">
      <ContextMenuRoot<string>>
        <div className="overflow-hidden rounded-md border border-border bg-background">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted-background text-muted-foreground">
              <tr>
                {columns.map((column) => <ContextMenuTrigger<string, HTMLTableCellElement> key={column} payload={`column:${column}`}>
                  {(props) => <th {...props} scope="col" tabIndex={0} className="border-b border-border px-3 py-2 text-left font-medium outline-none hover:bg-background focus:bg-background">{column}</th>}
                </ContextMenuTrigger>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => <ContextMenuTrigger<string, HTMLTableRowElement> key={row[0]} payload={`row:${row[0]}`}>
                {(props) => <tr {...props} tabIndex={0} className="outline-none hover:bg-muted-background focus:bg-muted-background">{row.map((cell) => <td key={cell} className="border-b border-border px-3 py-2 last:text-right">{cell}</td>)}</tr>}
              </ContextMenuTrigger>)}
            </tbody>
          </table>
        </div>
        <ContextMenuPortal><ContextMenuContent><DataTableMenuContent /></ContextMenuContent></ContextMenuPortal>
      </ContextMenuRoot>
    </Card>
  )
}
