import { constructTable } from '@tanstack/table-core'
import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings'
import type { RowData, Table, TableFeatures, TableOptions, TableState } from '@tanstack/table-core'
import { prepareDataTableColumns } from './prepare-columns'

export interface DataTableController<TFeatures extends TableFeatures, TData extends RowData> {
  readonly table: Table<TFeatures, TData>
  getSnapshot: () => DataTableControllerSnapshot<TFeatures, TData>
  subscribe: (listener: () => void) => () => void
  setOptions: (options: TableOptions<TFeatures, TData>) => void
}

export interface DataTableControllerSnapshot<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  readonly revision: number
  readonly state: TableState<TFeatures>
  readonly options: TableOptions<TFeatures, TData>
}

/**
 * Constructs the single framework-neutral TanStack v9 table used by every
 * adapter. Framework packages only bridge this controller's subscription to
 * their native reactive primitive and render the resulting row/header model.
 */
export function createDataTableController<TFeatures extends TableFeatures, TData extends RowData>(
  options: TableOptions<TFeatures, TData>,
): DataTableController<TFeatures, TData> {
  const table = constructTable<TFeatures, TData>({
    ...options,
    columns: prepareDataTableColumns(options.columns),
    features: {
      coreReactivityFeature: storeReactivityBindings(),
      ...options.features,
    },
  })
  let revision = 0

  const getSnapshot = (): DataTableControllerSnapshot<TFeatures, TData> => ({
    revision,
    state: table.store.get(),
    options: table.options,
  })

  return {
    table,
    getSnapshot,
    subscribe: (listener) => {
      const notify = () => {
        revision += 1
        listener()
      }
      const stateSubscription = table.store.subscribe(notify)
      const optionsSubscription = table.optionsStore?.subscribe(notify)
      return () => {
        stateSubscription.unsubscribe()
        optionsSubscription?.unsubscribe()
      }
    },
    setOptions: (nextOptions) => {
      table.setOptions((previous) => ({
        ...previous,
        ...nextOptions,
        columns: prepareDataTableColumns(nextOptions.columns),
      }))
    },
  }
}
