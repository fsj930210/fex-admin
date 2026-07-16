import { expansionFeature, focusFeature } from '@fex/components-core'
import { createTreeController } from '@fex/components-core/tree/create-tree-controller'
import type { FocusFeatureApi } from '@fex/components-core/tree/features/focus'
import { Button } from '@fex/components-solid/ui/button'
import { Card } from '@fex/components-solid/ui/card'
import { createSignal } from 'solid-js'
import { DemoTree } from './demo-tree'
import { departmentFieldNames, departmentTreeData, type DepartmentNode } from './data'
export function MutationDemo() {
  const [data, setData] = createSignal<readonly DepartmentNode[]>(departmentTreeData)
  const controller = createTreeController<DepartmentNode>({
    treeData: departmentTreeData,
    fieldNames: departmentFieldNames,
    isLeaf: (n) => n.childCount === 0,
    features: [
      expansionFeature({ defaultExpandedKeys: ['company', 'engineering'] }),
      focusFeature(),
    ],
  })
  return (
    <Card
      title="External controller and node mutation"
      description="The controller can live outside Tree. Renaming keeps the normalized index and updates only the subscribed node row; structural actions return a new immutable tree through onTreeDataChange."
    >
      <div class="mb-space-md flex flex-wrap gap-space-sm">
        <Button
          size="sm"
          variant="outline"
          onClick={() => controller.updateNode('engineering', { name: 'Engineering (renamed)' })}
        >
          Rename Engineering
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            controller.insertNode({
              parentKey: 'engineering',
              node: {
                id: `api-${Date.now()}`,
                name: 'New API node',
                childrenList: [],
                childCount: 0,
              },
            })
          }
        >
          Add child
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => controller.getFeature<FocusFeatureApi>('focus')?.reveal('design')}
        >
          Reveal Design
        </Button>
      </div>
      <DemoTree
        controller={controller}
        treeData={data()}
        fieldNames={departmentFieldNames}
        isLeaf={(n) => n.childCount === 0}
        onTreeDataChange={setData}
        class="max-w-xl rounded-md border border-border bg-background p-space-sm"
      />
    </Card>
  )
}
