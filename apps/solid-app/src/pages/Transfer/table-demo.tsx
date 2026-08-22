import { rowSelectionFeature } from '@fex-design/core/data-table/features/row-selection'
import {
  createDataTableSelectionColumn,
  DataTable,
  tableFeatures,
} from '@fex-design/solid/primitive/data-table'
import { Transfer, type TransferPanelApi } from '@fex-design/solid/primitive/transfer'
import { createDataTable } from '@fex-design/solid/primitives/create-data-table'
import { Card } from '@fex-design/solid/ui/card'
import { createEffect } from 'solid-js'
import { fieldNames, members, type Member } from './data'
const features = tableFeatures({ rowSelectionFeature })
const columns = [
  createDataTableSelectionColumn({ mode: 'multiple' }),
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'department', header: 'Department' },
]
function Panel(props: { api: TransferPanelApi<Member> }) {
  const options = () => ({
    features,
    data: [...props.api.items],
    columns,
    getRowId: (row: Member) => row.id,
    enableRowSelection: (row: any) => row.original.disabled !== true,
    state: {
      rowSelection: Object.fromEntries(props.api.checkedKeys.map((key) => [String(key), true])),
    },
    onRowSelectionChange: (updater: any) => {
      const current = Object.fromEntries(props.api.checkedKeys.map((key) => [String(key), true]))
      const next = typeof updater === 'function' ? updater(current) : updater
      props.api.setCheckedKeys(Object.keys(next).filter((key) => next[key]))
    },
  })
  const table = createDataTable(options() as any)
  createEffect(() => table.setDataTableOptions(options() as any))
  return <DataTable table={table} />
}
export function TableDemo() {
  return (
    <Card
      title="Custom DataTable body"
      description="Each side can use row selection without reimplementing target-key updates or move-all filtering."
    >
      <Transfer
        items={members}
        fieldNames={fieldNames}
        defaultTargetKeys={['ada', 'susan']}
        panels={{
          source: { body: (api) => <Panel api={api} /> },
          target: { body: (api) => <Panel api={api} /> },
        }}
      />
    </Card>
  )
}
