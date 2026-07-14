import { createTreeController } from '@fex/components-core/tree/create-tree-controller'
import { expansionFeature, focusFeature } from '@fex/components-core'
import type { FocusFeatureApi } from '@fex/components-core/tree/features/focus'
import { Button } from '@fex/components-react/ui/button'
import { useState } from 'react'
import { departmentFieldNames, departmentTreeData, type DepartmentNode } from './data'
import { DemoTree } from './demo-tree'
import { TreeDemoSection } from './demo-section'

export function TreeMutationDemo() {
  const [treeData, setTreeData] = useState<readonly DepartmentNode[]>(departmentTreeData)
  const [controller] = useState(() =>
    createTreeController<DepartmentNode>({
      treeData: departmentTreeData,
      fieldNames: departmentFieldNames,
      isLeaf: (node) => node.childCount === 0,
      features: [expansionFeature({ defaultExpandedKeys: ['company', 'engineering'] }), focusFeature()],
    }),
  )

  return (
    <TreeDemoSection title="External controller and node mutation" description="The controller can live outside Tree. Renaming keeps the normalized index and updates only the subscribed node row; structural actions return a new immutable tree through onTreeDataChange.">
      <div className="mb-space-md flex flex-wrap gap-space-sm">
        <Button size="sm" variant="outline" onClick={() => controller.updateNode('engineering', { name: 'Engineering (renamed)' })}>
          Rename Engineering
        </Button>
        <Button size="sm" variant="outline" onClick={() => controller.insertNode({ parentKey: 'engineering', node: { id: `api-${Date.now()}`, name: 'New API node', childrenList: [], childCount: 0 } })}>
          Add child
        </Button>
        <Button size="sm" variant="outline" onClick={() => controller.getFeature<FocusFeatureApi>('focus')?.reveal('design')}>
          Reveal Design
        </Button>
      </div>
      <DemoTree
        controller={controller}
        treeData={treeData}
        fieldNames={departmentFieldNames}
        isLeaf={(node) => node.childCount === 0}
        onTreeDataChange={(nextTreeData) => setTreeData(nextTreeData)}
        className="max-w-xl rounded-md border border-border bg-background p-space-sm"
      />
    </TreeDemoSection>
  )
}
