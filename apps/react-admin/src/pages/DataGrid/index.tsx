import { Link } from 'react-router'
import { BasicDataGridDemo } from './basic-demo'
import { CellEditingDataGridDemo } from './cell-editing-demo'
import { ColumnPinningDataGridDemo } from './column-pinning-demo'
import { DndDataGridDemo } from './dnd-demo'
import { ExpansionDataGridDemo } from './expansion-demo'
import { FilteringDataGridDemo } from './filtering-demo'
import { GroupingDataGridDemo } from './grouping-demo'
import { HeaderGroupingDataGridDemo } from './header-grouping-demo'
import { OrderingDataGridDemo } from './ordering-demo'
import { PaginationDataGridDemo } from './pagination-demo'
import { PresentationDataGridDemo } from './presentation-demo'
import { RowPinningDataGridDemo } from './row-pinning-demo'
import { RowEditingDataGridDemo } from './row-editing-demo'
import { SelectionDataGridDemo } from './selection-demo'
import { SizingDataGridDemo } from './sizing-demo'
import { SortingDataGridDemo } from './sorting-demo'
import { VisibilityDataGridDemo } from './visibility-demo'
import { VirtualDataGridDemo } from './virtual-demo'

export function DataGridPage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-[1600px] space-y-space-xl">
        <header className="space-y-space-sm">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Data Grid primitive</h1>
            <p className="max-w-4xl text-sm leading-6 text-muted-foreground">
              React 19 adapter for TanStack Table v9 beta. Every capability is registered independently; the primitive renders the resulting table instance and leaves requests, DnD policy and business UI to callers.
            </p>
          </div>
        </header>
        <div className="space-y-space-xl">
          <BasicDataGridDemo />
          <HeaderGroupingDataGridDemo />
          <SortingDataGridDemo />
          <FilteringDataGridDemo />
          <PaginationDataGridDemo />
          <SelectionDataGridDemo />
          <ExpansionDataGridDemo />
          <VisibilityDataGridDemo />
          <OrderingDataGridDemo />
          <DndDataGridDemo />
          <ColumnPinningDataGridDemo />
          <RowPinningDataGridDemo />
          <SizingDataGridDemo />
          <GroupingDataGridDemo />
          <VirtualDataGridDemo />
          <CellEditingDataGridDemo />
          <RowEditingDataGridDemo />
          <PresentationDataGridDemo />
        </div>
      </div>
    </main>
  )
}
