import { Button } from '@fex/components-react/ui/button'
import { expansionFeature } from '@fex/components-core'
import { useRef } from 'react'
import { createLargeTreeData, departmentFieldNames } from './data'
import { DemoTree, type TreeVirtualViewportHandle } from './demo-tree'
import { TreeDemoSection } from './demo-section'

const largeTreeData = createLargeTreeData()

export function VirtualTreeDemo() {
  const viewportRef = useRef<TreeVirtualViewportHandle>(null)

  return (
    <TreeDemoSection title="Virtualization and locate" description="Only viewport rows mount. scrollToKey resolves a visible index before asking TanStack Virtual to scroll.">
      <div className="mb-space-md flex gap-space-sm">
        <Button
          size="sm"
          variant="outline"
          onClick={() => viewportRef.current?.scrollToKey(
            'large-3200',
            { reveal: true, align: 'start' },
          )}
        >
          Locate row 3201
        </Button>
      </div>
      <DemoTree
        treeData={largeTreeData}
        fieldNames={departmentFieldNames}
        isLeaf={(node) => node.childCount === 0}
        features={[expansionFeature({ defaultExpandedKeys: ['large-root'] })]}
        virtual
        height={320}
        virtualViewportRef={viewportRef}
        className="rounded-md border border-border bg-background p-space-sm"
      />
    </TreeDemoSection>
  )
}
