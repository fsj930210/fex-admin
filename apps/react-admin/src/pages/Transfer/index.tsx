import { Link } from 'react-router'
import { BasicTransferDemo } from './basic-demo'
import { CustomPanelTransferDemo } from './custom-panel-demo'
import { OneWayTransferDemo } from './one-way-demo'
import { TableTransferDemo } from './table-demo'
import { TreeTransferDemo } from './tree-demo'
import { ValidationTransferDemo } from './validation-demo'

export function TransferPage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-6xl space-y-space-xl">
        <header className="space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</Link>
          <div><h1 className="text-2xl font-semibold text-foreground">Transfer</h1><p className="max-w-3xl text-sm leading-6 text-muted-foreground">Move ordered data between two built-in panels while keeping headers, bodies, footers and actions independently composable.</p></div>
        </header>
        <div className="space-y-space-xl">
          <BasicTransferDemo />
          <OneWayTransferDemo />
          <CustomPanelTransferDemo />
          <TreeTransferDemo />
          <TableTransferDemo />
          <ValidationTransferDemo />
        </div>
      </div>
    </main>
  )
}
