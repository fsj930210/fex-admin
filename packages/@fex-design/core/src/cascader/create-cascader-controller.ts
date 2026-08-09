import { createStore } from '../store/create-store'
import {
  createCascaderModel,
  createCascaderPathKey,
  getCascaderDescendants,
  getCascaderPath,
} from './model'
import { searchCascaderPaths } from './search'
import type {
  CascaderChangeMeta,
  CascaderController,
  CascaderControllerOptions,
  CascaderNode,
  CascaderPathValue,
  CascaderSnapshot,
  CascaderValue,
} from './types'

function normalizeValue(value: CascaderValue, multiple: boolean): CascaderPathValue[] {
  if (!value) return []
  if (multiple) return value as CascaderPathValue[]
  return [value as CascaderPathValue]
}

export function createCascaderController(
  options: CascaderControllerOptions,
): CascaderController {
  let valueControlled = options.value !== undefined
  let openControlled = options.open !== undefined
  const initialKeys = normalizeValue(options.value ?? options.defaultValue, options.multiple === true).map(
    createCascaderPathKey,
  )
  const store = createStore<CascaderSnapshot>({
    open: options.open ?? options.defaultOpen ?? false,
    searchValue: '',
    activePath: initialKeys[0]
      ? (JSON.parse(initialKeys[0]) as CascaderPathValue).map((_, index, values) =>
          createCascaderPathKey(values.slice(0, index + 1)),
        )
      : [],
    selectedPathKeys: initialKeys,
    checkedKeys: initialKeys,
    indeterminateKeys: [],
    loadingKeys: [],
    interaction: null,
  })
  let resolvedSource = store.getSnapshot()
  let resolvedSnapshot = resolvedSource

  const model = () =>
    createCascaderModel(options.options ?? [], options.fieldNames, Boolean(options.loadData))
  const externalKeys = () => normalizeValue(options.value, options.multiple === true).map(createCascaderPathKey)
  const activePathForKey = (key: string | undefined) => key
    ? (JSON.parse(key) as CascaderPathValue).map((_, index, values) => createCascaderPathKey(values.slice(0, index + 1)))
    : []
  const conductionFor = (sourceKeys: readonly string[]) => {
    if (!options.multiple || options.checkStrictly) {
      return { checkedKeys: [...sourceKeys], indeterminateKeys: [] as string[] }
    }
    const currentModel = model()
    const checked = new Set(sourceKeys)
    const indeterminate = new Set<string>()
    const nodes = [...currentModel.nodes.values()].sort((a, b) => b.depth - a.depth)
    for (const node of nodes) {
      const children = currentModel.children.get(node.key)?.filter((child) => !child.disabled) ?? []
      if (!children.length) continue
      const checkedCount = children.filter((child) => checked.has(child.key)).length
      const mixed = children.some((child) => indeterminate.has(child.key))
      if (checkedCount === children.length) checked.add(node.key)
      else if (checkedCount > 0 || mixed) indeterminate.add(node.key)
    }
    return { checkedKeys: [...checked], indeterminateKeys: [...indeterminate] }
  }
  const snapshot = () => {
    const current = store.getSnapshot()
    const open = options.open ?? current.open
    const selectedPathKeys = valueControlled ? externalKeys() : current.selectedPathKeys
    const selectedChanged = selectedPathKeys.join('\0') !== resolvedSnapshot.selectedPathKeys.join('\0')
    if (current === resolvedSource && open === resolvedSnapshot.open && !selectedChanged) return resolvedSnapshot
    const sourceActiveUnchanged = current.activePath.join('\0') === resolvedSource.activePath.join('\0')
    const activePath = valueControlled && selectedChanged
      ? activePathForKey(selectedPathKeys[0])
      : sourceActiveUnchanged ? resolvedSnapshot.activePath : current.activePath
    resolvedSource = current
    const conduction = valueControlled ? conductionFor(selectedPathKeys) : undefined
    resolvedSnapshot = { ...current, open, activePath, selectedPathKeys, ...conduction }
    return resolvedSnapshot
  }
  const update = (patch: Partial<CascaderSnapshot>) =>
    store.updateSnapshot((current) => ({ ...current, ...patch }))
  const setOpen = (open: boolean) => {
    if (snapshot().open === open) return
    if (!openControlled) update({ open })
    options.onOpenChange?.(open)
  }
  const pathValueForKey = (key: string) => model().nodes.get(key)?.pathValues
  const emitValue = (keys: readonly string[], previous: CascaderValue) => {
    if (!valueControlled) update({ selectedPathKeys: keys, ...conductionFor(keys) })
    const values = keys.flatMap((key) => {
      const value = pathValueForKey(key)
      return value ? [value] : []
    })
    const value: CascaderValue = options.multiple ? values : values[0]
    const currentModel = model()
    const selectedPaths = keys.map((key) => getCascaderPath(currentModel, key).map((node) => node.option))
    const meta: CascaderChangeMeta = {
      selectedOptions: selectedPaths[0] ?? [],
      selectedPaths,
      previousValue: previous,
    }
    options.onChange?.(value, meta)
  }
  const previousValue = (): CascaderValue => {
    const values = snapshot().selectedPathKeys.flatMap((key) => {
      const value = pathValueForKey(key)
      return value ? [value] : []
    })
    return options.multiple ? values : values[0]
  }
  const controller: CascaderController = {
    getSnapshot: snapshot,
    subscribe: store.subscribe,
    getNode: (key) => model().nodes.get(key),
    getPath: (key) => getCascaderPath(model(), key),
    getColumns: () => {
      const currentModel = model()
      const columns: import('./types').CascaderColumn[] = [
        { parentKey: undefined, nodes: currentModel.roots },
      ]
      for (const key of snapshot().activePath) {
        const children = currentModel.children.get(key)
        if (children?.length) columns.push({ parentKey: key, nodes: children })
      }
      return columns
    },
    getSearchResults: () => searchCascaderPaths(model(), snapshot().searchValue, options.filterOption),
    getSelectedPaths: () => snapshot().selectedPathKeys.map((key) => getCascaderPath(model(), key)).filter((path) => path.length),
    refresh: () => {
      if (options.value !== undefined) valueControlled = true
      if (options.open !== undefined) openControlled = true
      update({})
    },
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggleOpen: () => setOpen(!snapshot().open),
    setSearchValue: (keyword) => {
      if (snapshot().searchValue === keyword) return
      update({ searchValue: keyword })
      options.onSearch?.(keyword)
    },
    activate: (key, interaction = 'pointer') => {
      const node = model().nodes.get(key)
      if (!node || node.disabled) return
      update({ activePath: node.pathKeys, interaction })
    },
    expand: (key) => {
      const node = model().nodes.get(key)
      if (!node || node.disabled || node.leaf) return
      controller.activate(key)
      if (!model().children.has(key)) void controller.load(key)
    },
    select: (key) => {
      const node = model().nodes.get(key)
      if (!node || node.disabled) return
      if (options.multiple) {
        if (node.leaf) {
          controller.toggleCheck(key)
          controller.setSearchValue('')
        } else {
          controller.expand(key)
        }
      }
      else if (node.leaf) {
        emitValue([key], previousValue())
        controller.setSearchValue('')
        controller.close()
      } else {
        controller.expand(key)
        if (options.changeOnSelect) emitValue([key], previousValue())
      }
    },
    toggleCheck: (key) => {
      const currentModel = model()
      const node = currentModel.nodes.get(key)
      if (!node || node.disabled) return
      const previous = previousValue()
      const checked = new Set(snapshot().checkedKeys)
      const shouldCheck = !checked.has(key)
      const affected = options.checkStrictly ? [node] : [node, ...getCascaderDescendants(currentModel, key)]
      for (const item of affected) if (!item.disabled) shouldCheck ? checked.add(item.key) : checked.delete(item.key)
      const submitKeys = [...checked].filter((itemKey) => {
        const item = currentModel.nodes.get(itemKey)
        return item && (options.checkStrictly || item.leaf)
      })
      emitValue(submitKeys, previous)
    },
    removePath: (key) => emitValue(snapshot().selectedPathKeys.filter((item) => item !== key), previousValue()),
    clear: () => {
      emitValue([], previousValue())
      controller.setSearchValue('')
    },
    moveActive: (direction) => {
      const columns = controller.getColumns()
      const activeKey = snapshot().activePath.at(-1)
      const column = [...columns].reverse().find((item) => item.nodes.some((node) => node.key === activeKey)) ?? columns[0]
      const enabled = column?.nodes.filter((node) => !node.disabled) ?? []
      if (!enabled.length) return
      const index = enabled.findIndex((node) => node.key === activeKey)
      controller.activate(enabled[(index + direction + enabled.length) % enabled.length]!.key, 'keyboard')
    },
    moveToBoundary: (position) => {
      const column = controller.getColumns().at(-1)
      const nodes = column?.nodes.filter((node) => !node.disabled) ?? []
      const node = position === 'first' ? nodes[0] : nodes.at(-1)
      if (node) controller.activate(node.key, 'keyboard')
    },
    moveToParent: () => {
      const parentKey = snapshot().activePath.at(-2)
      if (parentKey) controller.activate(parentKey, 'keyboard')
    },
    moveToChild: () => {
      const key = snapshot().activePath.at(-1)
      const child = key ? model().children.get(key)?.find((node) => !node.disabled) : undefined
      if (child) controller.activate(child.key, 'keyboard')
      else if (key) controller.expand(key)
    },
    selectActive: () => {
      const key = snapshot().activePath.at(-1)
      if (!key) return false
      controller.select(key)
      return true
    },
    load: async (key) => {
      const node = model().nodes.get(key)
      if (!node || node.leaf || !options.loadData || snapshot().loadingKeys.includes(key)) return
      update({ loadingKeys: [...snapshot().loadingKeys, key] })
      try { await options.loadData(getCascaderPath(model(), key).map((item) => item.option)) }
      finally { update({ loadingKeys: snapshot().loadingKeys.filter((item) => item !== key) }) }
    },
  }
  return controller
}
