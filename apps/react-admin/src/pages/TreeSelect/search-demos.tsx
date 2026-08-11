import { searchFeature } from '@fex-design/core'
import { createTreeController } from '@fex-design/core/tree/create-tree-controller'
import type { SearchFeatureApi } from '@fex-design/core/tree/features/search'
import { Card } from '@fex-design/react/ui/card'
import { useState } from 'react'
import { departmentFieldNames, departmentTreeData, type DepartmentNode } from '../Tree/data'
import { DemoTreeSelect } from './demo-shell'

const controller = createTreeController<DepartmentNode>({ treeData: departmentTreeData, fieldNames: departmentFieldNames, features: [searchFeature()] })

export function SearchDemos() {
  const [keyword, setKeyword] = useState('')
  const treeData = keyword
    ? controller.getFeature<SearchFeatureApi<DepartmentNode>>('search')?.getSubtree({ keyword, filterTreeNode: (node, value) => node.name.toLowerCase().includes(value.toLowerCase()) }) ?? []
    : departmentTreeData
  return (
    <Card title="同步搜索" description="输入框只负责搜索值；本示例复用 Tree 的 searchFeature，并渲染过滤后的树。">
      <DemoTreeSelect treeData={treeData} searchable searchValue={keyword} onSearchValueChange={setKeyword} />
    </Card>
  )
}
