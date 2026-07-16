import { constructTable } from '@tanstack/table-core'
import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings'
import type {
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import { prepareDataGridColumns } from './prepare-columns'

export interface DataGridController<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  readonly table: Table<TFeatures, TData>
  getSnapshot: () => DataGridControllerSnapshot<TFeatures, TData>
  subscribe: (listener: () => void) => () => void
  setOptions: (options: TableOptions<TFeatures, TData>) => void
}

export interface DataGridControllerSnapshot<
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
export function createDataGridController<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(options: TableOptions<TFeatures, TData>): DataGridController<TFeatures, TData> {
  const table = constructTable<TFeatures, TData>({
    ...options,
    columns: prepareDataGridColumns(options.columns),
    features: {
      coreReactivityFeature: storeReactivityBindings(),
      ...options.features,
    },
  })
  let revision = 0

  const getSnapshot = (): DataGridControllerSnapshot<TFeatures, TData> => ({
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
        columns: prepareDataGridColumns(nextOptions.columns),
      }))
    },
  }
}
