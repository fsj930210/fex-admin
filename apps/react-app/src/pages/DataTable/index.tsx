import { Link } from 'react-router'
import { BasicDataTableDemo } from './basic-demo'
import { CellEditingDataTableDemo } from './cell-editing-demo'
import { ColumnPinningDataTableDemo } from './column-pinning-demo'
import { DndDataTableDemo } from './dnd-demo'
import { ExpansionDataTableDemo } from './expansion-demo'
import { FilteringDataTableDemo } from './filtering-demo'
import { GroupingDataTableDemo } from './grouping-demo'
import { HeaderGroupingDataTableDemo } from './header-grouping-demo'
import { OrderingDataTableDemo } from './ordering-demo'
import { PaginationDataTableDemo } from './pagination-demo'
import { PresentationDataTableDemo } from './presentation-demo'
import { RowPinningDataTableDemo } from './row-pinning-demo'
import { RowEditingDataTableDemo } from './row-editing-demo'
import { SelectionDataTableDemo } from './selection-demo'
import { SizingDataTableDemo } from './sizing-demo'
import { SortingDataTableDemo } from './sorting-demo'
import { VisibilityDataTableDemo } from './visibility-demo'
import { VirtualDataTableDemo } from './virtual-demo'

export function DataTablePage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-[1600px] space-y-space-xl">
        <header className="space-y-space-sm">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            Back home
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Data Table primitive</h1>
            <p className="max-w-4xl text-sm leading-6 text-muted-foreground">
              React 19 adapter for TanStack Table v9 beta. Every capability is registered
              independently; the primitive renders the resulting table instance and leaves requests,
              DnD policy and business UI to callers.
            </p>
          </div>
        </header>
        <div className="space-y-space-xl">
          <BasicDataTableDemo />
          <HeaderGroupingDataTableDemo />
          <SortingDataTableDemo />
          <FilteringDataTableDemo />
          <PaginationDataTableDemo />
          <SelectionDataTableDemo />
          <ExpansionDataTableDemo />
          <VisibilityDataTableDemo />
          <OrderingDataTableDemo />
          <DndDataTableDemo />
          <ColumnPinningDataTableDemo />
          <RowPinningDataTableDemo />
          <SizingDataTableDemo />
          <GroupingDataTableDemo />
          <VirtualDataTableDemo />
          <CellEditingDataTableDemo />
          <RowEditingDataTableDemo />
          <PresentationDataTableDemo />
        </div>
      </div>
    </main>
  )
}
