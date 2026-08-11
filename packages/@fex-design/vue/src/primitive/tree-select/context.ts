import type { TreeSelectController, TreeSelectSnapshot } from '@fex-design/core/tree-select/types'
import type { ComputedRef, InjectionKey, Ref } from 'vue'

export interface TreeSelectContext<TNode = unknown> {
  controller: TreeSelectController<TNode>
  snapshot: ComputedRef<TreeSelectSnapshot<TNode>>
  searchable: ComputedRef<boolean>
  searchValue: Ref<string>
  setSearchValue(value: string): void
  openPanel(): void
  closePanel(): void
  togglePanel(): void
}

export const treeSelectKey = Symbol('TreeSelect') as InjectionKey<TreeSelectContext>
