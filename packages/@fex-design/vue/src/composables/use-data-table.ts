import { createDataTableController } from '@fex-design/core/data-table/create-data-table-controller'
import type { RowData, Table, TableFeatures, TableOptions } from '@tanstack/table-core'
import type { ShallowRef } from 'vue'
import { useCoreStore } from './use-core-store'

export type VueDataTable<TFeatures extends TableFeatures, TData extends RowData> = Table<
  TFeatures,
  TData
> & {
  readonly dataTableSnapshot: ShallowRef<
    ReturnType<ReturnType<typeof createDataTableController<TFeatures, TData>>['getSnapshot']>
  >
  setDataTableOptions: (options: TableOptions<TFeatures, TData>) => void
}

export function useDataTable<TFeatures extends TableFeatures, TData extends RowData>(
  options: TableOptions<TFeatures, TData>,
): VueDataTable<TFeatures, TData> {
  const controller = createDataTableController(options)
  const dataTableSnapshot = useCoreStore(controller)
  return Object.assign(controller.table, {
    dataTableSnapshot,
    setDataTableOptions: controller.setOptions,
  })
}
