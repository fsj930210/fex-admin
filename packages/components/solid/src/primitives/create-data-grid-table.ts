import { createDataGridController } from '@fex/components-core/data-grid/create-data-grid-controller'
import type { DataGridController } from '@fex/components-core/data-grid/create-data-grid-controller'
import type { RowData, Table, TableFeatures, TableOptions } from '@tanstack/table-core'
import type { Accessor } from 'solid-js'
import { createCoreStoreSignal } from './create-core-store-signal'

export type SolidDataGridTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table<TFeatures, TData> & {
  readonly dataGridSnapshot: Accessor<ReturnType<DataGridController<TFeatures, TData>['getSnapshot']>>
  setDataGridOptions: (options: TableOptions<TFeatures, TData>) => void
}

export function createDataGridTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(options: TableOptions<TFeatures, TData>): SolidDataGridTable<TFeatures, TData> {
  const controller = createDataGridController(options)
  const dataGridSnapshot = createCoreStoreSignal(controller)

  return Object.assign(controller.table, {
    dataGridSnapshot,
    setDataGridOptions: controller.setOptions,
  })
}
