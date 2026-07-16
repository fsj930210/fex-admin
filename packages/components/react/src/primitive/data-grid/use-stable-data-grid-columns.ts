import {
  dataGridRemoteFilterFn,
} from '@fex/components-core/data-grid/features/column-filtering'
import { dataGridRemoteSortFn } from '@fex/components-core/data-grid/features/row-sorting'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import type {
  ColumnDef,
  RowData,
  TableFeatures,
} from '@tanstack/react-table'
import { useRef } from 'react'

type UnknownColumnDef = ColumnDef<TableFeatures, RowData, unknown>

interface StableColumnsCache<TColumn> {
  signature: string
  latest: Map<string, TColumn>
  columns: readonly TColumn[]
}

function resolveColumnId(column: UnknownColumnDef, path: string): string {
  if (column.id) return column.id
  if ('accessorKey' in column && column.accessorKey !== undefined) {
    return String(column.accessorKey).replaceAll('.', '_')
  }
  if (typeof column.header === 'string') return column.header
  throw new Error(
    `[DataGrid] Column at ${path} needs a stable id. accessorKey columns derive it automatically; accessorFn, display and grouped columns must provide id.`,
  )
}

function collectColumns(
  columns: readonly UnknownColumnDef[],
  latest: Map<string, UnknownColumnDef>,
  path = 'columns',
): string {
  return columns
    .map((column, index) => {
      const currentPath = `${path}[${index}]`
      const id = resolveColumnId(column, currentPath)
      if (latest.has(id)) throw new Error(`[DataGrid] Duplicate column id "${id}".`)
      latest.set(id, column)
      const children = 'columns' in column && column.columns
      const childSignature = children ? collectColumns(children, latest, `${currentPath}.columns`) : ''
      const meta = column.meta as DataGridColumnMeta | undefined
      const accessor = 'accessorKey' in column
        ? `key:${String(column.accessorKey)}`
        : 'accessorFn' in column
          ? 'fn'
          : 'display'
      const templates = `${column.header === undefined ? 0 : 1}${column.cell === undefined ? 0 : 1}${column.footer === undefined ? 0 : 1}`
      return `${id}:${children ? 'group' : accessor}:${templates}:${Boolean(meta?.filterFn)}:${Boolean(meta?.sortFn)}[${childSignature}]`
    })
    .join('|')
}

function renderLatestTemplate(id: string, key: 'header' | 'cell' | 'footer', cache: StableColumnsCache<UnknownColumnDef>) {
  return (context: unknown) => {
    const template = cache.latest.get(id)?.[key]
    return typeof template === 'function' ? template(context as never) : template
  }
}

function cloneStableColumns(
  source: readonly UnknownColumnDef[],
  cache: StableColumnsCache<UnknownColumnDef>,
): readonly UnknownColumnDef[] {
  return source.map((column) => {
    const id = resolveColumnId(column, 'columns')
    const children = 'columns' in column && column.columns
    const clone: Record<string, unknown> = {
      ...column,
      id,
      meta: new Proxy({}, {
        get: (_target, key) => (cache.latest.get(id)?.meta as Record<PropertyKey, unknown> | undefined)?.[key],
        has: (_target, key) => key in ((cache.latest.get(id)?.meta as object | undefined) ?? {}),
        ownKeys: () => Reflect.ownKeys((cache.latest.get(id)?.meta as object | undefined) ?? {}),
        getOwnPropertyDescriptor: () => ({ configurable: true, enumerable: true }),
      }),
    }

    for (const templateKey of ['header', 'cell', 'footer'] as const) {
      if (column[templateKey] === undefined) {
        delete clone[templateKey]
      } else {
        clone[templateKey] = renderLatestTemplate(id, templateKey, cache)
      }
    }

    if ('accessorFn' in column) {
      clone.accessorFn = (row: unknown, index: number) => {
        const accessor = (cache.latest.get(id) as UnknownColumnDef & { accessorFn?: (value: unknown, rowIndex: number) => unknown })?.accessorFn
        return accessor?.(row, index)
      }
    }

    if (children) {
      clone.columns = cloneStableColumns(children, cache)
    } else {
      const filterFn = (...args: unknown[]) => {
        const meta = cache.latest.get(id)?.meta as DataGridColumnMeta | undefined
        return meta?.filterFn
          ? meta.filterFn(...(args as Parameters<NonNullable<typeof meta.filterFn>>))
          : dataGridRemoteFilterFn(...(args as Parameters<typeof dataGridRemoteFilterFn>))
      }
      Object.defineProperties(filterFn, {
        autoRemove: { get: () => (cache.latest.get(id)?.meta as DataGridColumnMeta | undefined)?.filterFn?.autoRemove ?? dataGridRemoteFilterFn.autoRemove },
        resolveFilterValue: { get: () => (cache.latest.get(id)?.meta as DataGridColumnMeta | undefined)?.filterFn?.resolveFilterValue },
        resolveDataValue: { get: () => (cache.latest.get(id)?.meta as DataGridColumnMeta | undefined)?.filterFn?.resolveDataValue },
      })
      const sortFn = (...args: unknown[]) => {
        const meta = cache.latest.get(id)?.meta as DataGridColumnMeta | undefined
        return meta?.sortFn
          ? meta.sortFn(...(args as Parameters<NonNullable<typeof meta.sortFn>>))
          : dataGridRemoteSortFn(...(args as Parameters<typeof dataGridRemoteSortFn>))
      }
      Object.defineProperty(sortFn, 'resolveDataValue', {
        get: () => (cache.latest.get(id)?.meta as DataGridColumnMeta | undefined)?.sortFn?.resolveDataValue,
      })
      clone.filterFn = filterFn
      clone.sortFn = sortFn
    }

    return clone as unknown as UnknownColumnDef
  })
}

/**
 * Keeps TanStack's structural column input stable while forwarding the latest
 * header/cell/footer and local filter/sort functions. Inline column arrays are safe.
 */
export function useStableDataGridColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(columns: readonly ColumnDef<TFeatures, TData, unknown>[]) {
  const cacheRef = useRef<StableColumnsCache<UnknownColumnDef> | null>(null)
  const latest = new Map<string, UnknownColumnDef>()
  const unknownColumns = columns as unknown as readonly UnknownColumnDef[]
  const signature = collectColumns(unknownColumns, latest)

  if (!cacheRef.current || cacheRef.current.signature !== signature) {
    const cache: StableColumnsCache<UnknownColumnDef> = { signature, latest, columns: [] }
    cache.columns = cloneStableColumns(unknownColumns, cache)
    cacheRef.current = cache
  } else {
    cacheRef.current.latest = latest
  }

  return cacheRef.current.columns as unknown as readonly ColumnDef<TFeatures, TData, unknown>[]
}
