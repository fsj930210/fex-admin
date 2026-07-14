import { checkFeature, expansionFeature } from '@fex/components-core'
import { useState } from 'react'
import { departmentFieldNames, departmentTreeData } from './data'
import { DemoTree } from './demo-tree'
import { TreeDemoSection } from './demo-section'

export function CheckTreeDemo() {
  const [cascadeKeys, setCascadeKeys] = useState<readonly (string | number)[]>([])
  const [strictKeys, setStrictKeys] = useState<readonly (string | number)[]>([])

  return (
    <TreeDemoSection title="Check modes" description="Cascade links parent and children; strict keeps every node independent.">
      <div className="grid gap-space-lg lg:grid-cols-2">
        <div className="space-y-space-sm">
          <p className="text-sm font-medium">Cascade</p>
          <DemoTree
            treeData={departmentTreeData}
            fieldNames={departmentFieldNames}
            isLeaf={(node) => node.childCount === 0}
            features={[expansionFeature({ defaultExpandedKeys: ['company', 'engineering'] }), checkFeature()]}
            checkable
            checkedKeys={cascadeKeys}
            onCheckedKeysChange={setCascadeKeys}
            className="rounded-md border border-border bg-background p-space-sm"
          />
        </div>
        <div className="space-y-space-sm">
          <p className="text-sm font-medium">Strict</p>
          <DemoTree
            treeData={departmentTreeData}
            fieldNames={departmentFieldNames}
            isLeaf={(node) => node.childCount === 0}
            features={[expansionFeature({ defaultExpandedKeys: ['company', 'engineering'] }), checkFeature({ mode: 'strict' })]}
            checkable
            checkedKeys={strictKeys}
            onCheckedKeysChange={setStrictKeys}
            className="rounded-md border border-border bg-background p-space-sm"
          />
        </div>
      </div>
    </TreeDemoSection>
  )
}
