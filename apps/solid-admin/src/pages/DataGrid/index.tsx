import { A } from '@solidjs/router'
import { BasicDataGridDemo } from './basic-demo'
import { HeaderGroupingDataGridDemo } from './header-grouping-demo'
import { SortingDataGridDemo } from './sorting-demo'
import { FilteringDataGridDemo } from './filtering-demo'
import { PaginationDataGridDemo } from './pagination-demo'
import { SelectionDataGridDemo } from './selection-demo'
import { ExpansionDataGridDemo } from './expansion-demo'
import { VisibilityDataGridDemo } from './visibility-demo'
import { OrderingDataGridDemo } from './ordering-demo'
import { DndDataGridDemo } from './dnd-demo'
import { ColumnPinningDataGridDemo } from './column-pinning-demo'
import { RowPinningDataGridDemo } from './row-pinning-demo'
import { SizingDataGridDemo } from './sizing-demo'
import { GroupingDataGridDemo } from './grouping-demo'
import { VirtualDataGridDemo } from './virtual-demo'
import { CellEditingDataGridDemo } from './cell-editing-demo'
import { RowEditingDataGridDemo } from './row-editing-demo'
import { PresentationDataGridDemo } from './presentation-demo'

export function DataGridPage() {
  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-[1600px] space-y-space-xl">
        <header class="space-y-space-sm">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">
            Back home
          </A>
          <div>
            <h1 class="text-2xl font-semibold text-foreground">Data Grid primitive</h1>
            <p class="max-w-4xl text-sm leading-6 text-muted-foreground">
              Solid adapter for the shared TanStack Table v9 core controller.
            </p>
          </div>
        </header>
        <div class="space-y-space-xl">
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
