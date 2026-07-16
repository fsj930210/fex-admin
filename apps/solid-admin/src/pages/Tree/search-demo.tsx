import { expansionFeature, searchFeature } from '@fex/components-core'
import { createTreeController } from '@fex/components-core/tree/create-tree-controller'
import type { SearchFeatureApi } from '@fex/components-core/tree/features/search'
import { Input } from '@fex/components-solid/primitive/input'
import { Card } from '@fex/components-solid/ui/card'
import { createMemo, createSignal, Show } from 'solid-js'
import { DemoTree } from './demo-tree'
import { departmentFieldNames, departmentTreeData, type DepartmentNode } from './data'
const controller = createTreeController<DepartmentNode>({
  treeData: departmentTreeData,
  fieldNames: departmentFieldNames,
  isLeaf: (n) => n.childCount === 0,
  features: [
    expansionFeature({ defaultExpandedKeys: ['company', 'engineering', 'product'] }),
    searchFeature(),
  ],
})
export function SearchDemo() {
  const [keyword, setKeyword] = createSignal('')
  const subtree = createMemo(
    () =>
      controller
        .getFeature<SearchFeatureApi<DepartmentNode>>('search')
        ?.getSubtree({
          keyword: keyword(),
          filterTreeNode: (n, v) => n.name.toLowerCase().includes(v.toLowerCase()),
        }) ?? [],
  )
  const highlight = (title: string) => {
    const index = title.toLowerCase().indexOf(keyword().toLowerCase())
    return index < 0 ? (
      title
    ) : (
      <>
        {title.slice(0, index)}
        <mark class="rounded-sm bg-warning/20 px-0.5 text-inherit">
          {title.slice(index, index + keyword().length)}
        </mark>
        {title.slice(index + keyword().length)}
      </>
    )
  }
  return (
    <Card
      title="Search data and custom title rendering"
      description="The core returns filtered tree data; title rendering decides how a keyword is highlighted."
    >
      <Input
        value={keyword()}
        onInput={(e) => setKeyword(e.currentTarget.value)}
        placeholder="Search departments"
        class="mb-space-md max-w-sm"
      />
      <div hidden={Boolean(keyword().trim())}>
        <DemoTree<DepartmentNode>
          controller={controller}
          treeData={departmentTreeData}
          fieldNames={departmentFieldNames}
          isLeaf={(n) => n.childCount === 0}
          features={[
            expansionFeature({ defaultExpandedKeys: ['company', 'engineering', 'product'] }),
          ]}
          class="max-w-xl rounded-md border border-border bg-background p-space-sm"
        />
      </div>
      <Show when={Boolean(keyword().trim())}>
        <DemoTree<DepartmentNode>
          treeData={subtree()}
          fieldNames={departmentFieldNames}
          isLeaf={(n) => n.childCount === 0}
          features={[
            expansionFeature({ defaultExpandedKeys: ['company', 'engineering', 'product'] }),
          ]}
          searchKeyword={keyword()}
          titleRender={({ item }) => highlight(String(item.node.name))}
          class="max-w-xl rounded-md border border-border bg-background p-space-sm"
        />
      </Show>
    </Card>
  )
}
