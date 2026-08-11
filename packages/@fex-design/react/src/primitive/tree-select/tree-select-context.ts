import type { TreeSelectController, TreeSelectSnapshot } from '@fex-design/core/tree-select/types'
import { createContext, use } from 'react'

export interface TreeSelectContextValue<TNode = unknown> {
  controller: TreeSelectController<TNode>
  snapshot: TreeSelectSnapshot<TNode>
  searchable: boolean
  searchValue: string
  setSearchValue(value: string): void
  openPanel(): void
  closePanel(): void
}

export const TreeSelectContext = createContext<TreeSelectContextValue | null>(null)

export function useTreeSelect<TNode = unknown>() {
  const context = use(TreeSelectContext)
  if (!context) throw new Error('useTreeSelect must be used inside TreeSelectRoot.')
  return context as TreeSelectContextValue<TNode>
}
