import { expansionFeature } from '@fex/components-core'
import { departmentFieldNames, departmentTreeData } from './data'
import { DemoTree } from './demo-tree'
import { TreeDemoSection } from './demo-section'

export function BasicTreeDemo() {
  return (
    <TreeDemoSection title="Basic" description="fieldNames maps backend fields without a render-time data conversion.">
      <DemoTree
        treeData={departmentTreeData}
        fieldNames={departmentFieldNames}
        isLeaf={(node) => node.childCount === 0}
        features={[expansionFeature({ defaultExpandedKeys: ['company'] })]}
        className="max-w-xl rounded-md border border-border bg-background p-space-sm"
      />
    </TreeDemoSection>
  )
}
