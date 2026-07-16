import { createDataGridController } from '@fex/components-core/data-grid/create-data-grid-controller'
import type {
  DataGridController,
  DataGridControllerSnapshot,
} from '@fex/components-core/data-grid/create-data-grid-controller'
import type { RowData, Table, TableFeatures, TableOptions } from '@tanstack/table-core'
import type { Readable } from 'svelte/store'

import { readableCoreStore } from './core-store'

export type SvelteDataGridTable<TFeatures extends TableFeatures, TData extends RowData> = Table<
  TFeatures,
  TData
> & {
  readonly dataGridSnapshot: Readable<DataGridControllerSnapshot<TFeatures, TData>>
  setDataGridOptions: (options: TableOptions<TFeatures, TData>) => void
}

export function createDataGridTable<TFeatures extends TableFeatures, TData extends RowData>(
  options: TableOptions<TFeatures, TData>,
): SvelteDataGridTable<TFeatures, TData> {
  const controller: DataGridController<TFeatures, TData> = createDataGridController(options)
  return Object.assign(controller.table, {
    dataGridSnapshot: readableCoreStore(controller),
    setDataGridOptions: controller.setOptions,
  })
}
