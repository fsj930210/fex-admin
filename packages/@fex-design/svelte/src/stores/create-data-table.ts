import { createDataTableController } from '@fex-design/core/data-table/create-data-table-controller'
import type {
  DataTableController,
  DataTableControllerSnapshot,
} from '@fex-design/core/data-table/create-data-table-controller'
import type { RowData, Table, TableFeatures, TableOptions } from '@tanstack/table-core'
import type { Readable } from 'svelte/store'

import { readableCoreStore } from './core-store'

export type SvelteDataTable<TFeatures extends TableFeatures, TData extends RowData> = Table<
  TFeatures,
  TData
> & {
  readonly dataTableSnapshot: Readable<DataTableControllerSnapshot<TFeatures, TData>>
  setDataTableOptions: (options: TableOptions<TFeatures, TData>) => void
}

export function createDataTable<TFeatures extends TableFeatures, TData extends RowData>(
  options: TableOptions<TFeatures, TData>,
): SvelteDataTable<TFeatures, TData> {
  const controller: DataTableController<TFeatures, TData> = createDataTableController(options)
  return Object.assign(controller.table, {
    dataTableSnapshot: readableCoreStore(controller),
    setDataTableOptions: controller.setOptions,
  })
}
