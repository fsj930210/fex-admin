import { Link } from 'react-router'
import { AsyncTreeDemo } from './async-demo'
import { BasicTreeDemo } from './basic-demo'
import { TreeBatchActionsDemo } from './batch-actions-demo'
import { CheckTreeDemo } from './check-demo'
import { ControlledTreeDemo } from './controlled-demo'
import { TreeDndDemo } from './dnd-demo'
import { TreeMutationDemo } from './mutation-demo'
import { SearchTreeDemo } from './search-demo'
import { VirtualTreeDemo } from './virtual-demo'

export function TreePage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-sm">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            Back home
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Tree</h1>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Headless tree state, field mapping, async children, search data, keyboard navigation and virtual rendering.
            </p>
          </div>
        </header>
        <div className="space-y-space-xl">
          <BasicTreeDemo />
          <ControlledTreeDemo />
          <TreeBatchActionsDemo />
          <TreeMutationDemo />
          <TreeDndDemo />
          <CheckTreeDemo />
          <AsyncTreeDemo />
          <SearchTreeDemo />
          <VirtualTreeDemo />
        </div>
      </div>
    </main>
  )
}
