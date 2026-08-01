import { rowSelectionFeature } from '@fex/components-core/data-grid/features/row-selection'
import {
  createDataGridSelectionColumn,
  DataGrid,
  tableFeatures,
} from '@fex/components-solid/primitive/data-grid'
import { Transfer, type TransferPanelApi } from '@fex/components-solid/primitive/transfer'
import { createDataGridTable } from '@fex/components-solid/primitives/create-data-grid-table'
import { Card } from '@fex/components-solid/ui/card'
import { createEffect } from 'solid-js'
import { fieldNames, members, type Member } from './data'
const features = tableFeatures({ rowSelectionFeature })
const columns = [
  createDataGridSelectionColumn({ mode: 'multiple' }),
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
  const table = createDataGridTable(options() as any)
  createEffect(() => table.setDataGridOptions(options() as any))
  return <DataGrid table={table} />
}
export function TableDemo() {
  return (
    <Card
      title="Custom DataGrid body"
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
