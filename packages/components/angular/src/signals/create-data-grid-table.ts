import { createDataGridController } from '@fex/components-core/data-grid/create-data-grid-controller'
import type { DataGridControllerSnapshot } from '@fex/components-core/data-grid/create-data-grid-controller'
import type { RowData, Table, TableFeatures, TableOptions } from '@tanstack/table-core'
import type { Signal } from '@angular/core'

import { createCoreStoreSignal } from './core-store-signal'

export type AngularDataGridTable<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
> = Table<TFeatures, TData> & {
  readonly dataGridSnapshot: Signal<DataGridControllerSnapshot<TFeatures, TData>>
  setDataGridOptions: (options: TableOptions<TFeatures, TData>) => void
}

export function createDataGridTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(options: TableOptions<TFeatures, TData>): AngularDataGridTable<TFeatures, TData> {
  const controller = createDataGridController(options)
  return Object.assign(controller.table, {
    dataGridSnapshot: createCoreStoreSignal(controller),
    setDataGridOptions: controller.setOptions,
  })
}
