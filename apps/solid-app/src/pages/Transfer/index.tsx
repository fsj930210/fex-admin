import { A } from '@solidjs/router'
import { BasicDemo } from './basic-demo'
import { OneWayDemo } from './one-way-demo'
import { CustomDemo } from './custom-demo'
import { TreeDemo } from './tree-demo'
import { TableDemo } from './table-demo'
import { ValidationDemo } from './validation-demo'
export function TransferPage() {
  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-6xl space-y-space-xl">
        <header class="space-y-space-md">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">
            Back home
          </A>
          <div>
            <h1 class="text-2xl font-semibold text-foreground">Transfer</h1>
            <p class="max-w-3xl text-sm leading-6 text-muted-foreground">
              Move ordered data between two built-in panels while keeping headers, bodies, footers
              and actions independently composable.
            </p>
          </div>
        </header>
        <div class="space-y-space-xl">
          <BasicDemo />
          <OneWayDemo />
          <CustomDemo />
          <TreeDemo />
          <TableDemo />
          <ValidationDemo />
        </div>
      </div>
    </main>
  )
}
