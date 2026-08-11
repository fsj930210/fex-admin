import { Injectable, NotFoundException } from '@nestjs/common'
import { departmentTree } from './tree.data.js'
import type {
  DepartmentNode,
  TreePathNode,
  TreeSearchResult,
  TreeSubtreeResponse,
  TreeSubtreesResponse,
} from './tree.types.js'

function withoutChildren(node: DepartmentNode): DepartmentNode {
  const { children: _children, ...rest } = node
  return rest
}

@Injectable()
export class TreeService {
  getRoots() {
    return departmentTree.map(withoutChildren)
  }

  getChildren(key: string) {
    const found = this.findNode(key)
    if (!found) throw new NotFoundException(`Tree node ${key} was not found.`)
    return (found.node.children ?? []).map(withoutChildren)
  }

  search(keyword: string): TreeSearchResult[] {
    const normalized = keyword.trim().toLocaleLowerCase()
    if (!normalized) return []
    const results: TreeSearchResult[] = []
    const visit = (nodes: readonly DepartmentNode[], ancestors: readonly TreePathNode[]) => {
      for (const node of nodes) {
        const path = [...ancestors, { key: node.id, label: node.name }]
        if (node.name.toLocaleLowerCase().includes(normalized)) {
          results.push({ node: withoutChildren(node), path })
        }
        visit(node.children ?? [], path)
      }
    }
    visit(departmentTree, [])
    return results.slice(0, 50)
  }

  searchTree(keyword: string): DepartmentNode[] {
    const normalized = keyword.trim().toLocaleLowerCase()
    if (!normalized) return []
    const filter = (nodes: readonly DepartmentNode[]): DepartmentNode[] => nodes.flatMap((node) => {
      const children = filter(node.children ?? [])
      if (!node.name.toLocaleLowerCase().includes(normalized) && children.length === 0) return []
      return [{ ...withoutChildren(node), ...(children.length ? { children } : {}) }]
    })
    return filter(departmentTree)
  }

  getSubtree(key: string): TreeSubtreeResponse {
    const found = this.findNode(key)
    if (!found) throw new NotFoundException(`Tree node ${key} was not found.`)
    let child = withoutChildren(found.node)
    for (let index = found.ancestors.length - 1; index >= 0; index -= 1) {
      const ancestor = found.ancestors[index]!
      child = { ...withoutChildren(ancestor), children: [child] }
    }
    return {
      treeData: [child],
      expandedKeys: found.ancestors.map((node) => node.id),
      targetKey: key,
    }
  }

  getSubtrees(keys: readonly string[]): TreeSubtreesResponse {
    const targetKeys = [...new Set(keys.filter(Boolean))]
    const selected = new Set(targetKeys)
    for (const key of targetKeys) {
      if (!this.findNode(key)) throw new NotFoundException(`Tree node ${key} was not found.`)
    }
    const expandedKeys = new Set<string>()
    const collect = (nodes: readonly DepartmentNode[]): DepartmentNode[] => nodes.flatMap((node) => {
      const children = collect(node.children ?? [])
      if (!selected.has(node.id) && children.length === 0) return []
      if (children.length) expandedKeys.add(node.id)
      return [{ ...withoutChildren(node), ...(children.length ? { children } : {}) }]
    })
    return { treeData: collect(departmentTree), expandedKeys: [...expandedKeys], targetKeys }
  }

  private findNode(key: string) {
    const visit = (
      nodes: readonly DepartmentNode[],
      ancestors: readonly DepartmentNode[],
    ): { node: DepartmentNode; ancestors: DepartmentNode[] } | undefined => {
      for (const node of nodes) {
        if (node.id === key) return { node, ancestors: [...ancestors] }
        const found = visit(node.children ?? [], [...ancestors, node])
        if (found) return found
      }
      return undefined
    }
    return visit(departmentTree, [])
  }
}
