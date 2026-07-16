<script setup lang="ts">
import { columnOrderingFeature } from '@fex/components-core/data-grid/features/column-ordering'
import { columnPinningFeature } from '@fex/components-core/data-grid/features/column-pinning'
import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  DataGrid,
  DataGridColumnOverlay,
  DataGridRowOverlay,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-vue/primitive/data-grid'
import { useDataGridTable } from '@fex/components-vue/composables/use-data-grid-table'
import { useSortable } from '@fex/components-vue/composables/use-sortable'
import { EllipsisIcon } from '@fex/components-vue/icon/more'
import { computed, h, ref, watch } from 'vue'

import { people5, type Person } from './data'
import DemoSection from './demo-section.vue'

const columnModules = { columnOrderingFeature, columnPinningFeature, columnSizingFeature }
type ColumnFeatures = typeof columnModules & {
  columnMeta: DataGridColumnMeta<ColumnFeatures, Person>
}
const columnFeatures: ColumnFeatures = tableFeatures({ ...columnModules, columnMeta: {} })

type RowFeatures = {
  columnSizingFeature: typeof columnSizingFeature
  columnMeta: DataGridColumnMeta<RowFeatures, Person>
}
const rowFeatures: RowFeatures = tableFeatures({ columnSizingFeature, columnMeta: {} })

const initialOrder = ['name', 'department', 'status', 'id', 'age', 'visits', 'progress']
const columnGroups: Partial<Record<string, 'identity' | 'metrics'>> = {
  name: 'identity',
  department: 'identity',
  status: 'identity',
  visits: 'metrics',
  progress: 'metrics',
}
const labels: Record<string, string> = {
  name: 'Name',
  department: 'Department',
  status: 'Status',
  id: 'ID',
  age: 'Age',
  visits: 'Visits',
  progress: 'Progress',
}

function createColumnGrid(constrained: boolean) {
  const order = ref([...initialOrder])
  const message = ref('Drag a header with the project useSortable composable.')
  const leaf = (id: string): ColumnDef<ColumnFeatures, Person> =>
    ({
      accessorKey: id,
      size: id === 'name' ? 180 : id === 'department' ? 170 : 140,
      header: () => h('span', { class: 'inline-flex items-center gap-2' }, [h(EllipsisIcon, { class: 'size-4 rotate-90 text-muted-foreground' }), labels[id]]),
    }) as unknown as ColumnDef<ColumnFeatures, Person>
  const leaves = initialOrder.map(leaf)
  const columns: ColumnDef<ColumnFeatures, Person>[] = constrained
    ? [
        {
          id: 'identity',
          header: 'Identity',
          columns: leaves.filter(
            (column) =>
              'accessorKey' in column &&
              ['name', 'department', 'status'].includes(String(column.accessorKey)),
          ),
        },
        ...leaves.filter(
          (column) => 'accessorKey' in column && ['id', 'age'].includes(String(column.accessorKey)),
        ),
        {
          id: 'metrics',
          header: 'Metrics',
          columns: leaves.filter(
            (column) =>
              'accessorKey' in column &&
              ['visits', 'progress'].includes(String(column.accessorKey)),
          ),
        },
      ]
    : leaves
  const table = useDataGridTable({
    features: columnFeatures,
    data: people5,
    columns,
    getRowId: (row) => row.id,
    initialState: {
      columnOrder: order.value,
      ...(constrained ? { columnPinning: { start: ['name'], end: ['progress'] } } : {}),
    },
  })
  let activeColumnId: string | null = null
  let overColumnId: string | null = null
  const onChange = (next: string[]) => {
    const source = activeColumnId ?? ''
    const target = overColumnId ?? ''
    if (
      constrained &&
      (['name', 'progress'].includes(source) || ['name', 'progress'].includes(target))
    ) {
      message.value = 'Rejected: pinned columns cannot be moved or targeted.'
      table.setColumnOrder([...order.value])
      return
    }
    if (constrained && columnGroups[source] !== columnGroups[target]) {
      message.value = 'Rejected: columns must be in the same group, or both ungrouped.'
      table.setColumnOrder([...order.value])
      return
    }
    order.value = [...next]
    table.setColumnOrder([...next])
    sortable.update({ items: [...next], axis: 'x', onChange })
    message.value = `Moved ${source} near ${target}.`
  }
  const sortable = useSortable({ items: order.value, axis: 'x', onChange })
  // Sortable is an external controller; mirror its preview into TanStack so
  // headers and body cells move together while the pointer is down.
  watch(sortable.snapshot, (current) => {
    if (typeof current.activeId === 'string') activeColumnId = current.activeId
    if (typeof current.overId === 'string') overColumnId = current.overId
    table.setColumnOrder(
      current.activeId === null ? [...order.value] : [...(sortable.previewItems.value as string[])],
    )
  })
  const start = (event: PointerEvent, id: string) => {
    activeColumnId = id
    overColumnId = null
    sortable.update({ items: order.value, axis: 'x', onChange })
    sortable.onItemPointerDown(event, id)
  }
  const activeHeader = computed(() =>
    typeof sortable.snapshot.value.activeId === 'string'
      ? table
          .getFlatHeaders()
          .find((header) => header.column.id === sortable.snapshot.value.activeId)
      : undefined,
  )
  return {
    table,
    sortable,
    start,
    message,
    activeHeader: () => activeHeader.value,
    constrained,
  }
}

const free = createColumnGrid(false)
const locked = createColumnGrid(true)
const rowOrder = ref(people5.map((person) => person.id))
const rowColumns: ColumnDef<RowFeatures, Person>[] = [
  { id: '__drag__', header: '', cell: () => h(EllipsisIcon, { class: 'size-4 rotate-90 text-muted-foreground' }), size: 44 },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'department', header: 'Department' },
  { accessorKey: 'status', header: 'Status' },
]
const rowData = (order: readonly string[] = rowOrder.value) =>
  order
    .map((id) => people5.find((person) => person.id === id))
    .filter((row): row is Person => row !== undefined)
const rowTable = useDataGridTable({
  features: rowFeatures,
  data: rowData(),
  columns: rowColumns,
  getRowId: (row) => row.id,
})
const onRowChange = (next: string[]) => {
  rowOrder.value = [...next]
  rowSortable.update({ items: [...next], axis: 'y', onChange: onRowChange })
}
const rowSortable = useSortable({ items: rowOrder.value, axis: 'y', onChange: onRowChange })
watch(rowSortable.snapshot, (current) => {
  rowTable.setDataGridOptions({
    features: rowFeatures,
    data: rowData(
      current.activeId === null ? rowOrder.value : (rowSortable.previewItems.value as string[]),
    ),
    columns: rowColumns,
    getRowId: (row) => row.id,
  })
})
const startRow = (event: PointerEvent, id: string) => {
  rowSortable.update({ items: rowOrder.value, axis: 'y', onChange: onRowChange })
  rowSortable.onItemPointerDown(event, id)
}
const activeRow = computed(() =>
  typeof rowSortable.snapshot.value.activeId === 'string'
    ? rowTable.getRowModel().rows.find((row) => row.id === rowSortable.snapshot.value.activeId)
    : undefined,
)

function motionRef(register: (id: string, element: HTMLElement | null) => unknown, id: string) {
  return (element: Element | null) =>
    register(id, element instanceof globalThis.HTMLElement ? element : null)
}
</script>

<template>
  <DemoSection
    title="Column and row DnD with project Sortable"
    description="Both axes reuse the existing useSortable controller, overlay and motion registry. DataGrid only exposes native part props so callers can attach the project interaction without binding a policy into the table primitive."
  >
    <div class="space-y-space-lg">
      <section
        v-for="item in [free, locked]"
        :key="String(item.constrained)"
        class="space-y-space-sm"
      >
        <h3 class="text-sm font-medium text-foreground">
          {{ item.constrained ? 'Column: group boundaries + pinned locked' : 'Column reorder' }}
        </h3>
        <div :ref="item.sortable.setContainerRef()">
          <DataGrid
            :table="item.table"
            :get-header-props="
              (header) =>
                header.isPlaceholder ||
                header.column.columns.length ||
                (item.constrained && ['name', 'progress'].includes(header.column.id))
                  ? {}
                  : {
                      ref: item.sortable.setItemRef(header.column.id),
                      'data-sortable-id': header.column.id,
                      class: 'cursor-grab touch-none select-none',
                      onPointerdown: (event: PointerEvent) => item.start(event, header.column.id),
                      style: item.sortable.getItemStyle(header.column.id),
                    }
            "
            :get-cell-props="
              (cell) => ({
                ref: motionRef(item.sortable.registerMotionTarget, cell.column.id),
                style: {
                  ...item.sortable.getMotionStyle(cell.column.id),
                  visibility:
                    item.sortable.snapshot.value.activeId === cell.column.id ? 'hidden' : undefined,
                },
              })
            "
          />
        </div>
        <p class="text-xs text-muted-foreground">{{ item.message }}</p>
        <Teleport to="body">
          <DataGridColumnOverlay
            v-if="item.activeHeader()"
            :header="item.activeHeader()!"
            :table="item.table"
            :style="{ ...item.sortable.getOverlayStyle(), height: 'auto' }"
          />
        </Teleport>
      </section>

      <section class="space-y-space-sm">
        <h3 class="text-sm font-medium text-foreground">Row reorder</h3>
        <div :ref="rowSortable.setContainerRef()">
          <DataGrid
            :table="rowTable"
            :get-row-props="
              (row) => ({
                ref: rowSortable.setItemRef(row.id),
                'data-sortable-id': row.id,
                class: 'cursor-grab touch-none select-none',
                onPointerdown: (event: PointerEvent) => startRow(event, row.id),
                style: rowSortable.getItemStyle(row.id),
              })
            "
          />
        </div>
        <p class="text-xs text-muted-foreground">Current row order: {{ rowOrder.join(' → ') }}</p>
        <Teleport to="body">
          <DataGridRowOverlay
            v-if="activeRow"
            :row="activeRow"
            :table="rowTable"
            :style="rowSortable.getOverlayStyle()"
          />
        </Teleport>
      </section>
    </div>
  </DemoSection>
</template>
