import { createDataGridController } from '@fex/components-core/data-grid/create-data-grid-controller'
import type { RowData, Table, TableFeatures, TableOptions } from '@tanstack/table-core'
import type { ShallowRef } from 'vue'
import { useCoreStore } from './use-core-store'

export type VueDataGridTable<TFeatures extends TableFeatures, TData extends RowData> = Table<
  TFeatures,
  TData
> & {
  readonly dataGridSnapshot: ShallowRef<
    ReturnType<ReturnType<typeof createDataGridController<TFeatures, TData>>['getSnapshot']>
  >
  setDataGridOptions: (options: TableOptions<TFeatures, TData>) => void
}

export function useDataGridTable<TFeatures extends TableFeatures, TData extends RowData>(
  options: TableOptions<TFeatures, TData>,
): VueDataGridTable<TFeatures, TData> {
  const controller = createDataGridController(options)
  const dataGridSnapshot = useCoreStore(controller)
  return Object.assign(controller.table, {
    dataGridSnapshot,
    setDataGridOptions: controller.setOptions,
  })
}
