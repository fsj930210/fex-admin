import { expansionFeature } from '@fex/components-core'
import type { TreeVirtualViewportHandle } from '@fex/components-solid/primitive/tree'
import { Button } from '@fex/components-solid/ui/button'
import { Card } from '@fex/components-solid/ui/card'
import { DemoTree } from './demo-tree'
import { createLargeTreeData, departmentFieldNames } from './data'
const data = createLargeTreeData()
export function VirtualDemo() {
  let viewport: TreeVirtualViewportHandle | undefined
  return (
    <Card
      title="Virtualization and locate"
      description="Only viewport rows mount. scrollToKey resolves a visible index before asking TanStack Virtual to scroll."
    >
      <div class="mb-space-md flex gap-space-sm">
        <Button
          size="sm"
          variant="outline"
          onClick={() => viewport?.scrollToKey('large-3200', { reveal: true, align: 'start' })}
        >
          Locate row 3201
        </Button>
      </div>
      <DemoTree
        ref={(handle) => (viewport = handle)}
        treeData={data}
        fieldNames={departmentFieldNames}
        isLeaf={(n) => n.childCount === 0}
        features={[expansionFeature({ defaultExpandedKeys: ['large-root'] })]}
        virtual
        height={320}
        class="rounded-md border border-border bg-background p-space-sm"
      />
    </Card>
  )
}
