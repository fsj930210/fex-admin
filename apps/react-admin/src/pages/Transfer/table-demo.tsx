import { rowSelectionFeature } from '@fex/components-core/data-grid/features/row-selection'
import { createDataGridSelectionColumn, DataGrid, tableFeatures, useDataGridTable, type ColumnDef } from '@fex/components-react/primitive/data-grid'
import type { TransferPanelRenderApi } from '@fex/components-react/primitive/transfer'
import { Transfer } from '@fex/components-react/primitive/transfer'
import { transferFieldNames, transferMembers, type TransferMember } from './data'
import { TransferDemoSection } from './demo-section'

const features = tableFeatures({ rowSelectionFeature })

function TransferTable({ panel }: { panel: TransferPanelRenderApi<TransferMember> }) {
  const columns: ColumnDef<typeof features, TransferMember>[] = [
    createDataGridSelectionColumn<typeof features, TransferMember>({ mode: 'multiple' }),
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'department', header: 'Department' },
  ]
  const selection = Object.fromEntries(panel.checkedKeys.map((key) => [String(key), true]))
  const table = useDataGridTable({
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
  return <DataGrid table={table} />
}

export function TableTransferDemo() {
  return (
    <TransferDemoSection title="Custom DataGrid body" description="Each side can use row selection without reimplementing target-key updates or move-all filtering.">
      <Transfer
        data-testid="table-transfer"
        items={transferMembers}
        fieldNames={transferFieldNames}
        defaultTargetKeys={['ada', 'susan']}
        panels={{
          source: { body: (panel) => <TransferTable panel={panel} /> },
          target: { body: (panel) => <TransferTable panel={panel} /> },
        }}
        className={{ source: { body: 'overflow-hidden p-0' }, target: { body: 'overflow-hidden p-0' } }}
      />
    </TransferDemoSection>
  )
}
