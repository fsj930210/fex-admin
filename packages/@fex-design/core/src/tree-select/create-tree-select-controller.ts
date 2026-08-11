import { createSelectionController } from '../selection/create-selection-controller'
import { createStore } from '../store/create-store'
import type {
  TreeSelectController,
  TreeSelectItem,
  TreeSelectOptions,
  TreeSelectSnapshot,
  TreeSelectValue,
} from './types'

function valuesEqual(left: readonly TreeSelectValue[], right: readonly TreeSelectValue[]) {
  return left.length === right.length && left.every((value, index) => value === right[index])
}

function itemsEqual<TNode>(left: TreeSelectItem<TNode> | undefined, right: TreeSelectItem<TNode>) {
  return left?.value === right.value &&
    left.label === right.label &&
    left.node === right.node &&
    left.path === right.path &&
    left.disabled === right.disabled
}

export function createTreeSelectController<TNode = unknown>(
  initialOptions: TreeSelectOptions<TNode> = {},
): TreeSelectController<TNode> {
  let options = initialOptions
  let valueControlled = initialOptions.value !== undefined
  const items = new Map<TreeSelectValue, TreeSelectItem<TNode>>()
  const store = createStore<TreeSelectSnapshot<TNode>>({
    values: [],
    selectedItems: [],
    multiple: options.multiple === true,
    disabled: options.disabled === true,
  })
  const selection = createSelectionController({
    get value() {
      if (!valueControlled) return undefined
      return Array.isArray(options.value)
        ? [...options.value]
        : (options.value === undefined ? [] : options.value as TreeSelectValue)
    },
    get defaultValue() {
      return Array.isArray(options.defaultValue)
        ? [...options.defaultValue]
        : (options.defaultValue as TreeSelectValue | undefined)
    },
    get multiple() {
      return options.multiple
    },
    onChange(values, meta) {
      publish(values)
      options.onChange?.(options.multiple ? values : values[0], {
        selectedItems: resolveItems(values),
        previousValues: meta.previousValues,
        changedValues: meta.changedValues,
      })
    },
  })

  function resolveItems(values: readonly TreeSelectValue[]) {
    return values.map(
      (value) => items.get(value) ?? { value, label: String(value) },
    )
  }

  function publish(values = selection.getSnapshot().values) {
    const next: TreeSelectSnapshot<TNode> = {
      values,
      selectedItems: resolveItems(values),
      multiple: options.multiple === true,
      disabled: options.disabled === true,
    }
    const previous = store.getSnapshot()
    if (
      previous.multiple === next.multiple &&
      previous.disabled === next.disabled &&
      valuesEqual(previous.values, next.values) &&
      previous.selectedItems.every((item, index) => item === next.selectedItems[index])
    ) return
    store.setSnapshot(next)
  }

  function registerItems(nextItems: readonly TreeSelectItem<TNode>[] | undefined) {
    nextItems?.forEach((item) => {
      if (!itemsEqual(items.get(item.value), item)) items.set(item.value, item)
    })
  }

  registerItems(options.items)

  const controller: TreeSelectController<TNode> = {
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,
    updateOptions(nextOptions) {
      if (nextOptions.value !== undefined) valueControlled = true
      options = { ...options, ...nextOptions }
      registerItems(nextOptions.items)
      publish()
    },
    registerItem(item) {
      if (itemsEqual(items.get(item.value), item)) return
      items.set(item.value, item)
      if (selection.isSelected(item.value)) publish()
    },
    getItem: (value) => items.get(value),
    isSelected: selection.isSelected,
    select(item) {
      if (options.disabled || item.disabled) return
      items.set(item.value, item)
      selection.select(item.value)
    },
    toggle(item) {
      if (options.disabled || item.disabled) return
      items.set(item.value, item)
      selection.toggle(item.value)
    },
    setValues: selection.setValues,
    unselect: selection.unselect,
    clear: selection.clear,
  }
  publish()
  return controller
}
