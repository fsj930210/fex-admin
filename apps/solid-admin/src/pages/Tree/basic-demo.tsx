import { expansionFeature } from '@fex/components-core'
import { Card } from '@fex/components-solid/ui/card'
import { DemoTree } from './demo-tree'
import { departmentFieldNames, departmentTreeData } from './data'
export function BasicDemo() {
  return (
    <Card
      title="Basic"
      description="fieldNames maps backend fields without a render-time data conversion."
    >
      <DemoTree
        treeData={departmentTreeData}
        fieldNames={departmentFieldNames}
        isLeaf={(n) => n.childCount === 0}
        features={[expansionFeature({ defaultExpandedKeys: ['company'] })]}
        class="max-w-xl rounded-md border border-border bg-background p-space-sm"
      />
    </Card>
  )
}
