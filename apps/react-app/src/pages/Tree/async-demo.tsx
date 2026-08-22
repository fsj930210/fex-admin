import { asyncLoadFeature, expansionFeature } from '@fex-design/core'
import type { DepartmentNode } from './data'
import { departmentFieldNames } from './data'
import { DemoTree } from './demo-tree'
import { TreeDemoSection } from './demo-section'
import { getDemoTreeChildren, getDemoTreeRoots, type DemoDepartmentNode } from '@fex/mock/tree-api'
import { useState } from 'react'
import useMount from '@fex-design/react/hooks/use-mount'

const convert = (nodes: readonly DemoDepartmentNode[]): DepartmentNode[] => nodes.map((node) => ({ id: node.id, name: node.name, childCount: node.childCount, ...(node.disabled === undefined ? {} : { disabled: node.disabled }) }))
const loadChildren = async (node: { key: string | number }, context: { signal: AbortSignal }) => {
  try { return convert(await getDemoTreeChildren(node.key, context.signal)) }
  catch (error) { if (error instanceof DOMException && error.name === 'AbortError') return []; throw error }
}

export function AsyncTreeDemo() {
  const [asyncTreeData, setAsyncTreeData] = useState<DepartmentNode[]>([])
  useMount(() => {
    const request = new AbortController()
    void getDemoTreeRoots(request.signal)
      .then((nodes) => setAsyncTreeData(convert(nodes)))
      .catch((error) => { if (error.name !== 'AbortError') throw error })
    return () => request.abort()
  })
  return (
    <TreeDemoSection
      title="Async children"
      description="A node without children can still expand when isLeaf says it may have descendants."
    >
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
