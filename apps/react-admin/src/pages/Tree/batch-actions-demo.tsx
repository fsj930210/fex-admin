import { createTreeController } from '@fex/components-core/tree/create-tree-controller'
import { checkFeature, expansionFeature, selectionFeature } from '@fex/components-core'
import type { CheckFeatureApi } from '@fex/components-core/tree/features/check'
import type { ExpansionFeatureApi } from '@fex/components-core/tree/features/expansion'
import type { SelectionFeatureApi } from '@fex/components-core/tree/features/selection'
import { Button } from '@fex/components-react/ui/button'
import { useState } from 'react'
import { departmentFieldNames, departmentTreeData, type DepartmentNode } from './data'
import { DemoTree } from './demo-tree'
import { TreeDemoSection } from './demo-section'

export function TreeBatchActionsDemo() {
  const [controller] = useState(() =>
    createTreeController<DepartmentNode>({
      treeData: departmentTreeData,
      fieldNames: departmentFieldNames,
      isLeaf: (node) => node.childCount === 0,
      features: [expansionFeature(), selectionFeature({ multiple: true }), checkFeature()],
    }),
  )

  return (
    <TreeDemoSection title="Controller batch actions" description="All batch operations are explicit controller actions. selectAll only acts when multiple selection is enabled.">
      <div className="mb-space-md flex flex-wrap gap-space-sm">
        <Button size="sm" variant="outline" onClick={() => controller.getFeature<ExpansionFeatureApi>('expansion')?.expandAll()}>Expand all</Button>
        <Button size="sm" variant="outline" onClick={() => controller.getFeature<ExpansionFeatureApi>('expansion')?.collapseAll()}>Collapse all</Button>
        <Button size="sm" variant="outline" onClick={() => controller.getFeature<SelectionFeatureApi>('selection')?.selectAll()}>Select all</Button>
        <Button size="sm" variant="outline" onClick={() => controller.getFeature<SelectionFeatureApi>('selection')?.clear()}>Clear selection</Button>
        <Button size="sm" variant="outline" onClick={() => controller.getFeature<CheckFeatureApi>('check')?.checkAll()}>Check all</Button>
        <Button size="sm" variant="outline" onClick={() => controller.getFeature<CheckFeatureApi>('check')?.clear()}>Clear checks</Button>
      </div>
      <DemoTree controller={controller} treeData={departmentTreeData} fieldNames={departmentFieldNames} isLeaf={(node) => node.childCount === 0} checkable className="max-w-xl rounded-md border border-border bg-background p-space-sm" />
    </TreeDemoSection>
  )
}
