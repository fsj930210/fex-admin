import type { SelectionValue } from '../selection/types'

export type TreeSelectValue = SelectionValue

export interface TreeSelectItem<TNode = unknown> {
  value: TreeSelectValue
  label: string
  node?: TNode | undefined
  path?: readonly { key: TreeSelectValue; label: string }[] | undefined
  disabled?: boolean | undefined
}

export interface TreeSelectChangeMeta<TNode = unknown> {
  selectedItems: readonly TreeSelectItem<TNode>[]
  previousValues: readonly TreeSelectValue[]
  changedValues: readonly TreeSelectValue[]
}

export interface TreeSelectOptions<TNode = unknown> {
  items?: readonly TreeSelectItem<TNode>[] | undefined
  value?: TreeSelectValue | readonly TreeSelectValue[] | undefined
  defaultValue?: TreeSelectValue | readonly TreeSelectValue[] | undefined
  multiple?: boolean | undefined
  disabled?: boolean | undefined
  onChange?: (
    value: TreeSelectValue | TreeSelectValue[] | undefined,
    meta: TreeSelectChangeMeta<TNode>,
  ) => void
}

export interface TreeSelectSnapshot<TNode = unknown> {
  values: readonly TreeSelectValue[]
  selectedItems: readonly TreeSelectItem<TNode>[]
  multiple: boolean
  disabled: boolean
}

export interface TreeSelectController<TNode = unknown> {
  getSnapshot(): TreeSelectSnapshot<TNode>
  subscribe(listener: () => void): () => void
  updateOptions(options: Partial<TreeSelectOptions<TNode>>): void
  registerItem(item: TreeSelectItem<TNode>): void
  getItem(value: TreeSelectValue): TreeSelectItem<TNode> | undefined
  isSelected(value: TreeSelectValue): boolean
  select(item: TreeSelectItem<TNode>): void
  toggle(item: TreeSelectItem<TNode>): void
  setValues(values: readonly TreeSelectValue[]): void
  unselect(value: TreeSelectValue): void
  clear(): void
}
