import { createTreeController } from '@fex/components-core/tree/create-tree-controller'
import { dndFeature, expansionFeature } from '@fex/components-core'
import type { TreeController } from '@fex/components-core/tree/types'
import { TreeDropIndicator, TreeItem, TreeRoot, TreeTitle, TreeTrigger, TreeViewport } from '@fex/components-react/primitive/tree'
import { useTreeDndItem } from '@fex/components-react/primitive/tree/use-tree-dnd-item'
import { useState } from 'react'
import {
  departmentFieldNames,
  departmentTreeData,
  isDepartmentLeaf,
  type DepartmentNode,
} from './data'
import { TreeDemoSection } from './demo-section'

function DraggableTreeRow({ controller, itemKey }: { controller: TreeController<DepartmentNode>; itemKey: string | number }) {
  const dnd = useTreeDndItem({ tree: controller, itemKey })
  return (
    <TreeItem<DepartmentNode> itemKey={itemKey}>
      {({ item, itemProps }) => (
        <div
          {...itemProps}
          {...dnd.itemProps}
          className={itemProps.className}
          style={{ ...itemProps.style, ...dnd.itemProps.style }}
        >
          <TreeTrigger itemKey={item.key} />
          <TreeTitle>{item.node.name}</TreeTitle>
          <TreeDropIndicator item={item} intent={dnd.intent} style={dnd.dropIndicatorStyle} />
        </div>
      )}
    </TreeItem>
  )
}

export function TreeDndDemo() {
  const [controller] = useState(() => createTreeController<DepartmentNode>({
    treeData: departmentTreeData,
    fieldNames: departmentFieldNames,
    isLeaf: isDepartmentLeaf,
    features: [
      expansionFeature({ defaultExpandedKeys: ['company', 'engineering', 'product'] }),
      dndFeature(),
    ],
  }))

  return (
    <TreeDemoSection title="Optional drag and drop feature" description="This example uses a custom 24px indent. Vertical movement chooses the row; moving the dragged row one indent into it makes it a child.">
      <TreeRoot controller={controller} indent={24} className="max-w-xl rounded-md border border-border bg-background p-space-sm">
        <TreeViewport>{(item) => <DraggableTreeRow key={item.key} controller={controller} itemKey={item.key} />}</TreeViewport>
      </TreeRoot>
    </TreeDemoSection>
  )
}
