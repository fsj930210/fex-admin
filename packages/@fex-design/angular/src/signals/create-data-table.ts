import { createDataTableController } from '@fex-design/core/data-table/create-data-table-controller'
import type { DataTableControllerSnapshot } from '@fex-design/core/data-table/create-data-table-controller'
import type { RowData, Table, TableFeatures, TableOptions } from '@tanstack/table-core'
import type { Signal } from '@angular/core'

import { createCoreStoreSignal } from './core-store-signal'

export type AngularDataTable<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
> = Table<TFeatures, TData> & {
  readonly dataTableSnapshot: Signal<DataTableControllerSnapshot<TFeatures, TData>>
  setDataTableOptions: (options: TableOptions<TFeatures, TData>) => void
}

export function createDataTable<TFeatures extends TableFeatures, TData extends RowData>(
  options: TableOptions<TFeatures, TData>,
): AngularDataTable<TFeatures, TData> {
  const controller = createDataTableController(options)
  return Object.assign(controller.table, {
    dataTableSnapshot: createCoreStoreSignal(controller),
    setDataTableOptions: controller.setOptions,
  })
}
