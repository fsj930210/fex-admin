import { A } from '@solidjs/router'
import { BasicDataTableDemo } from './basic-demo'
import { HeaderGroupingDataTableDemo } from './header-grouping-demo'
import { SortingDataTableDemo } from './sorting-demo'
import { FilteringDataTableDemo } from './filtering-demo'
import { PaginationDataTableDemo } from './pagination-demo'
import { SelectionDataTableDemo } from './selection-demo'
import { ExpansionDataTableDemo } from './expansion-demo'
import { VisibilityDataTableDemo } from './visibility-demo'
import { OrderingDataTableDemo } from './ordering-demo'
import { DndDataTableDemo } from './dnd-demo'
import { ColumnPinningDataTableDemo } from './column-pinning-demo'
import { RowPinningDataTableDemo } from './row-pinning-demo'
import { SizingDataTableDemo } from './sizing-demo'
import { GroupingDataTableDemo } from './grouping-demo'
import { VirtualDataTableDemo } from './virtual-demo'
import { CellEditingDataTableDemo } from './cell-editing-demo'
import { RowEditingDataTableDemo } from './row-editing-demo'
import { PresentationDataTableDemo } from './presentation-demo'

export function DataTablePage() {
  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-[1600px] space-y-space-xl">
        <header class="space-y-space-sm">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">
            Back home
          </A>
          <div>
            <h1 class="text-2xl font-semibold text-foreground">Data Table primitive</h1>
            <p class="max-w-4xl text-sm leading-6 text-muted-foreground">
              Solid adapter for the shared TanStack Table v9 core controller.
            </p>
          </div>
        </header>
        <div class="space-y-space-xl">
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
