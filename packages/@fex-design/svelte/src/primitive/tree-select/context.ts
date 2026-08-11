import type { TreeSelectController, TreeSelectSnapshot } from '@fex-design/core/tree-select/types'
import type { Readable } from 'svelte/store'

export const treeSelectContextKey = Symbol('tree-select')
export interface TreeSelectContext<TNode = unknown> {
  controller: TreeSelectController<TNode>
  snapshot: Readable<TreeSelectSnapshot<TNode>>
  searchable(): boolean
  searchValue(): string
  setSearchValue(value: string): void
  openPanel(): void
  closePanel(): void
}
