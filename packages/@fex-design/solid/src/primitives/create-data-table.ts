import { createDataTableController } from '@fex-design/core/data-table/create-data-table-controller'
import type { DataTableController } from '@fex-design/core/data-table/create-data-table-controller'
import type { RowData, Table, TableFeatures, TableOptions } from '@tanstack/table-core'
import type { Accessor } from 'solid-js'
import { createCoreStoreSignal } from './create-core-store-signal'

export type SolidDataTable<TFeatures extends TableFeatures, TData extends RowData> = Table<
  TFeatures,
  TData
> & {
  readonly dataTableSnapshot: Accessor<
    ReturnType<DataTableController<TFeatures, TData>['getSnapshot']>
  >
  setDataTableOptions: (options: TableOptions<TFeatures, TData>) => void
}

export function createDataTable<TFeatures extends TableFeatures, TData extends RowData>(
  options: TableOptions<TFeatures, TData>,
): SolidDataTable<TFeatures, TData> {
  const controller = createDataTableController(options)
  const dataTableSnapshot = createCoreStoreSignal(controller)

  return Object.assign(controller.table, {
    dataTableSnapshot,
    setDataTableOptions: controller.setOptions,
  })
}
