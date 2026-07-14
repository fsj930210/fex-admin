import { createTreeController } from '@fex/components-core/tree/create-tree-controller'
import { expansionFeature, searchFeature } from '@fex/components-core'
import type { SearchFeatureApi } from '@fex/components-core/tree/features/search'
import { Input } from '@fex/components-react/primitive/input'
import { useState } from 'react'
import { departmentFieldNames, departmentTreeData, type DepartmentNode } from './data'
import { DemoTree } from './demo-tree'
import { TreeDemoSection } from './demo-section'

const searchController = createTreeController<DepartmentNode>({
  treeData: departmentTreeData,
  fieldNames: departmentFieldNames,
  isLeaf: (node) => node.childCount === 0,
  features: [expansionFeature({ defaultExpandedKeys: ['company', 'engineering', 'product'] }), searchFeature()],
})

function highlight(title: string, keyword: string) {
  if (!keyword) return title
  const index = title.toLowerCase().indexOf(keyword.toLowerCase())
  if (index < 0) return title
  return (
    <>
      {title.slice(0, index)}
      <mark className="rounded-sm bg-warning/20 px-0.5 text-inherit">{title.slice(index, index + keyword.length)}</mark>
      {title.slice(index + keyword.length)}
    </>
  )
}

export function SearchTreeDemo() {
  const [keyword, setKeyword] = useState('')
  const subtree: readonly DepartmentNode[] = searchController.getFeature<SearchFeatureApi<DepartmentNode>>('search')?.getSubtree({
    keyword,
    filterTreeNode: (node, value) => node.name.toLowerCase().includes(value.toLowerCase()),
  }) ?? []
  const showingSearchTree = Boolean(keyword.trim())

  return (
    <TreeDemoSection title="Search data and custom title rendering" description="The core returns filtered tree data; title rendering decides how a keyword is highlighted.">
      <Input
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="Search departments"
        className="mb-space-md max-w-sm"
      />
      <div hidden={showingSearchTree}>
        <DemoTree<DepartmentNode>
          controller={searchController}
          treeData={departmentTreeData}
          fieldNames={departmentFieldNames}
          isLeaf={(node) => node.childCount === 0}
          features={[expansionFeature({ defaultExpandedKeys: ['company', 'engineering', 'product'] })]}
          className="max-w-xl rounded-md border border-border bg-background p-space-sm"
        />
      </div>
      {showingSearchTree ? (
        <DemoTree<DepartmentNode>
          treeData={subtree}
          fieldNames={departmentFieldNames}
          isLeaf={(node) => node.childCount === 0}
          features={[expansionFeature({ defaultExpandedKeys: ['company', 'engineering', 'product'] })]}
          searchKeyword={keyword}
          titleRender={({ item, searchKeyword }) => highlight(item.node.name, searchKeyword)}
          className="max-w-xl rounded-md border border-border bg-background p-space-sm"
        />
      ) : null}
    </TreeDemoSection>
  )
}
