import { createTreeController } from '@fex-design/core/tree/create-tree-controller'
import { expansionFeature, searchFeature } from '@fex-design/core'
import type { SearchFeatureApi } from '@fex-design/core/tree/features/search'
import { InputControl, InputRoot } from '@fex-design/react/primitive/input'
import { useState } from 'react'
import { departmentFieldNames, departmentTreeData, type DepartmentNode } from './data'
import { DemoTree } from './demo-tree'
import { TreeDemoSection } from './demo-section'
import { highlightTreeTitle } from './highlight-tree-title'

const searchController = createTreeController<DepartmentNode>({
  treeData: departmentTreeData,
  fieldNames: departmentFieldNames,
  isLeaf: (node) => node.childCount === 0,
  features: [
    expansionFeature({ defaultExpandedKeys: ['company', 'engineering', 'product'] }),
    searchFeature(),
  ],
})

export function SearchTreeDemo() {
  const [keyword, setKeyword] = useState('')
  const subtree: readonly DepartmentNode[] =
    searchController.getFeature<SearchFeatureApi<DepartmentNode>>('search')?.getSubtree({
      keyword,
      filterTreeNode: (node, value) => node.name.toLowerCase().includes(value.toLowerCase()),
    }) ?? []
  const showingSearchTree = Boolean(keyword.trim())

  return (
    <TreeDemoSection
      title="Search data and custom title rendering"
      description="The core returns filtered tree data; title rendering decides how a keyword is highlighted."
    >
      <InputRoot value={keyword} className="mb-space-md max-w-sm">
        <InputControl
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Search departments"
        />
      </InputRoot>
      <div hidden={showingSearchTree}>
        <DemoTree<DepartmentNode>
          controller={searchController}
          treeData={departmentTreeData}
          fieldNames={departmentFieldNames}
          isLeaf={(node) => node.childCount === 0}
          features={[
            expansionFeature({ defaultExpandedKeys: ['company', 'engineering', 'product'] }),
          ]}
          className="max-w-xl rounded-md border border-border bg-background p-space-sm"
        />
      </div>
      {showingSearchTree ? (
        <DemoTree<DepartmentNode>
          treeData={subtree}
          fieldNames={departmentFieldNames}
          isLeaf={(node) => node.childCount === 0}
          features={[
            expansionFeature({ defaultExpandedKeys: ['company', 'engineering', 'product'] }),
          ]}
          searchKeyword={keyword}
          titleRender={({ item, searchKeyword }) => highlightTreeTitle(item.node.name, searchKeyword)}
          className="max-w-xl rounded-md border border-border bg-background p-space-sm"
        />
      ) : null}
    </TreeDemoSection>
  )
}
