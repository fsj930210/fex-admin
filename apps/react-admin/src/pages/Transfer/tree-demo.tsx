import { checkFeature, expansionFeature } from '@fex/components-core'
import type { TransferPanelRenderApi } from '@fex/components-react/primitive/transfer'
import {
  TreeItem,
  TreeRoot,
  TreeTitle,
  TreeTrigger,
  TreeViewport,
} from '@fex/components-react/primitive/tree'
import { Checkbox } from '@fex/components-react/ui/checkbox'
import { Transfer } from '@fex/components-react/primitive/transfer'
import { transferFieldNames, transferMembers, type TransferMember } from './data'
import { TransferDemoSection } from './demo-section'

interface TransferTreeNode extends Record<string, unknown> {
  id: string
  name: string
  disabled?: boolean
  children?: TransferTreeNode[]
}

function TransferTree({ panel }: { panel: TransferPanelRenderApi<TransferMember> }) {
  const departments = Array.from(new Set(panel.items.map((item) => item.department)))
  const treeData: TransferTreeNode[] = departments.map((department) => ({
    id: `department:${department}`,
    name: department,
    children: panel.items.filter((item) => item.department === department),
  }))
  const checkedKeys = [...panel.checkedKeys]
  for (const group of treeData) {
    const enabledChildren = group.children?.filter((item) => item.disabled !== true) ?? []
    if (
      enabledChildren.length > 0 &&
      enabledChildren.every((item) => panel.checkedKeys.includes(item.id))
    ) {
      checkedKeys.push(group.id)
    }
  }
  return (
    <TreeRoot
      options={{
        treeData,
        fieldNames: { key: 'id', title: 'name', disabled: 'disabled' },
        features: [
          expansionFeature({ defaultExpandedKeys: treeData.map((item) => item.id) }),
          checkFeature(),
        ],
        checkedKeys,
        onCheckedKeysChange: panel.setCheckedKeys,
      }}
      className="w-full"
    >
      {(_tree) => (
        <TreeViewport<TransferTreeNode>>
          {(item) => (
            <TreeItem<TransferTreeNode> key={item.key} itemKey={item.key}>
              {({ item: current, itemProps, checkedState, actions }) => (
                <div {...itemProps}>
                  <TreeTrigger itemKey={current.key} />
                  <Checkbox
                    checked={checkedState}
                    disabled={current.disabled}
                    onClick={(event) => event.stopPropagation()}
                    onCheckedChange={() => actions.toggleChecked()}
                  />
                  <TreeTitle>{String(current.node.name)}</TreeTitle>
                </div>
              )}
            </TreeItem>
          )}
        </TreeViewport>
      )}
    </TreeRoot>
  )
}

export function TreeTransferDemo() {
  return (
    <TransferDemoSection
      title="Custom Tree body"
      description="The Tree only binds checkedKeys and setCheckedKeys; all four move operations remain owned by Transfer."
    >
      <Transfer
        data-testid="tree-transfer"
        items={transferMembers}
        fieldNames={transferFieldNames}
        defaultTargetKeys={['susan']}
        panels={{
          source: { body: (panel) => <TransferTree panel={panel} /> },
          target: { body: (panel) => <TransferTree panel={panel} /> },
        }}
      />
    </TransferDemoSection>
  )
}
