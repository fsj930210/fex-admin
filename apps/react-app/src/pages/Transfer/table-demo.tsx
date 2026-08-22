import {
  rowSelectionFeature,
  type RowSelectionState,
} from '@fex-design/core/data-table/features/row-selection'
import {
  createDataTableSelectionColumn,
  DataTable,
  tableFeatures,
  useDataTable,
  type ColumnDef,
} from '@fex-design/react/primitive/data-table'
import type { TransferPanelRenderApi } from '@fex-design/react/primitive/transfer'
import { Transfer } from '@fex-design/react/primitive/transfer'
import { transferFieldNames, transferMembers, type TransferMember } from './data'
import { TransferDemoSection } from './demo-section'

const features = tableFeatures({ rowSelectionFeature })

function TransferTable({ panel }: { panel: TransferPanelRenderApi<TransferMember> }) {
  const columns: ColumnDef<typeof features, TransferMember>[] = [
    createDataTableSelectionColumn<typeof features, TransferMember>({ mode: 'multiple' }),
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'department', header: 'Department' },
  ]
  const selection: RowSelectionState = Object.fromEntries(
    panel.checkedKeys.map((key) => [String(key), true]),
  )
  const table = useDataTable({
    features,
    data: panel.items,
    columns,
    getRowId: (row) => row.id,
    enableRowSelection: (row) => row.original.disabled !== true,
    state: { rowSelection: selection },
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(selection) : updater
      panel.setCheckedKeys(Object.keys(next).filter((key) => next[key]))
    },
  })
  return <DataTable table={table} />
}

export function TableTransferDemo() {
  return (
    <TransferDemoSection
      title="Custom DataTable body"
      description="Each side can use row selection without reimplementing target-key updates or move-all filtering."
    >
      <Transfer
        data-testid="table-transfer"
        items={transferMembers}
        fieldNames={transferFieldNames}
        defaultTargetKeys={['ada', 'susan']}
        panels={{
          source: { body: (panel) => <TransferTable panel={panel} /> },
          target: { body: (panel) => <TransferTable panel={panel} /> },
        }}
        className={{
          source: { body: 'overflow-hidden p-0' },
          target: { body: 'overflow-hidden p-0' },
        }}
      />
    </TransferDemoSection>
  )
}
