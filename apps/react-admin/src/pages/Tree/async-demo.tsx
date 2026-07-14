import { asyncLoadFeature, expansionFeature } from '@fex/components-core'
import type { DepartmentNode } from './data'
import { departmentFieldNames } from './data'
import { DemoTree } from './demo-tree'
import { TreeDemoSection } from './demo-section'

const asyncTreeData: DepartmentNode[] = [
  { id: 'remote-root', name: 'Remote root', childCount: 2 },
]

async function loadChildren(node: { key: string | number; node: DepartmentNode }) {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 800))
  return [
    { id: `${node.key}-a`, name: `${node.node.name} child A`, childCount: 0 },
    { id: `${node.key}-b`, name: `${node.node.name} child B`, childCount: 0 },
  ] satisfies DepartmentNode[]
}

export function AsyncTreeDemo() {
  return (
    <TreeDemoSection title="Async children" description="A node without children can still expand when isLeaf says it may have descendants.">
      <DemoTree
        treeData={asyncTreeData}
        fieldNames={departmentFieldNames}
        isLeaf={(node) => node.childCount === 0}
        features={[
          expansionFeature<DepartmentNode>(),
          asyncLoadFeature<DepartmentNode>({ loadChildren }),
        ]}
        className="max-w-xl rounded-md border border-border bg-background p-space-sm"
      />
    </TreeDemoSection>
  )
}
