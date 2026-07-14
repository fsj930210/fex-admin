import { Button } from '@fex/components-react/ui/button'
import { expansionFeature, focusFeature, keyboardFeature, selectionFeature } from '@fex/components-core'
import { useState } from 'react'
import { departmentFieldNames, departmentTreeData } from './data'
import { DemoTree } from './demo-tree'
import { TreeDemoSection } from './demo-section'

export function ControlledTreeDemo() {
  const [expandedKeys, setExpandedKeys] = useState<readonly (string | number)[]>(['company', 'engineering'])
  const [selectedKeys, setSelectedKeys] = useState<readonly (string | number)[]>([])

  return (
    <TreeDemoSection title="Controlled state" description="Expansion and selection can be owned outside Tree.">
      <div className="mb-space-md flex flex-wrap gap-space-sm">
        <Button size="sm" variant="outline" onClick={() => setExpandedKeys(['company', 'engineering', 'product'])}>
          Expand departments
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setExpandedKeys(['company', 'engineering'])
            setSelectedKeys(['frontend'])
          }}
        >
          Select Frontend
        </Button>
      </div>
      <DemoTree
        treeData={departmentTreeData}
        fieldNames={departmentFieldNames}
        isLeaf={(node) => node.childCount === 0}
        expandedKeys={expandedKeys}
        onExpandedKeysChange={setExpandedKeys}
        selectedKeys={selectedKeys}
        onSelectedKeysChange={setSelectedKeys}
        features={[expansionFeature(), selectionFeature(), focusFeature(), keyboardFeature()]}
        className="max-w-xl rounded-md border border-border bg-background p-space-sm"
      />
    </TreeDemoSection>
  )
}
