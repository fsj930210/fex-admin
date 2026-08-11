import { createTreeSelectController } from '@fex-design/core/tree-select/create-tree-select-controller'
import type { TreeSelectController, TreeSelectItem, TreeSelectValue } from '@fex-design/core/tree-select/types'
import { createContext, createEffect, createSignal, splitProps, useContext, type Accessor, type JSX, type ParentProps } from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger, type PopoverProps, type PopoverTriggerRenderProps } from '../popover/popover'

interface ContextValue<TNode = unknown> {
  controller: TreeSelectController<TNode>
  snapshot: Accessor<ReturnType<TreeSelectController<TNode>['getSnapshot']>>
  searchable: Accessor<boolean>
  searchValue: Accessor<string>
  setSearchValue(value: string): void
  openPanel(): void
  closePanel(): void
}
const Context = createContext<ContextValue>()
export function useTreeSelect<TNode = unknown>() {
  const context = useContext(Context)
  if (!context) throw new Error('useTreeSelect must be used inside TreeSelectRoot.')
  return context as ContextValue<TNode>
}

export interface TreeSelectRootProps<TNode = unknown> extends ParentProps, Omit<PopoverProps, 'children'> {
  controller?: TreeSelectController<TNode> | undefined
  items?: readonly TreeSelectItem<TNode>[] | undefined
  value?: TreeSelectValue | readonly TreeSelectValue[] | undefined
  defaultValue?: TreeSelectValue | readonly TreeSelectValue[] | undefined
  multiple?: boolean | undefined
  disabled?: boolean | undefined
  searchable?: boolean | undefined
  searchValue?: string | undefined
  defaultSearchValue?: string | undefined
  onSearchValueChange?: ((value: string) => void) | undefined
  onChange?: ((value: TreeSelectValue | TreeSelectValue[] | undefined, meta: unknown) => void) | undefined
}
export function TreeSelectRoot<TNode = unknown>(props: TreeSelectRootProps<TNode>) {
  const [local, popover] = splitProps(props, ['children', 'controller', 'items', 'value', 'defaultValue', 'multiple', 'disabled', 'searchable', 'searchValue', 'defaultSearchValue', 'onSearchValueChange', 'onChange'])
  const owned = createTreeSelectController<TNode>({
    get items() { return local.items }, get value() { return local.value }, get defaultValue() { return local.defaultValue },
    get multiple() { return local.multiple }, get disabled() { return local.disabled },
    onChange(value, meta) { local.onChange?.(value, meta) },
  })
  const controller = local.controller ?? owned
  const snapshot = createCoreStoreSignal(controller)
  const [localSearch, setLocalSearch] = createSignal(local.defaultSearchValue ?? '')
  const [localOpen, setLocalOpen] = createSignal(popover.defaultOpen ?? false)
  const searchValue = () => local.searchValue ?? localSearch()
  const setSearchValue = (value: string) => {
    if (local.searchValue === undefined) setLocalSearch(value)
    local.onSearchValueChange?.(value)
  }
  createEffect(() => controller.updateOptions({ items: local.items, value: local.value, multiple: local.multiple, disabled: local.disabled }))
  const resolvedOpen = () => popover.open ?? localOpen()
  const requestOpen = (value: boolean) => {
    if (popover.open === undefined) setLocalOpen(value)
    popover.onOpenChange?.(value, { source: 'trigger' } as never)
  }
  return <Context.Provider value={{ controller, snapshot, searchable: () => local.searchable === true, searchValue, setSearchValue, openPanel: () => requestOpen(true), closePanel: () => requestOpen(false) }}>
    <Popover {...popover} open={resolvedOpen()} trigger={popover.trigger ?? []} onOpenChange={(value, info) => { if (popover.open === undefined) setLocalOpen(value); popover.onOpenChange?.(value, info) }}>{local.children}</Popover>
  </Context.Provider>
}

export interface TreeSelectTriggerState<TNode = unknown> {
  trigger: PopoverTriggerRenderProps
  inputProps: { readOnly: boolean; value: string; onInput(event: InputEvent & { currentTarget: HTMLInputElement }): void; onFocus(): void; onClick(): void }
  selectedItems: readonly TreeSelectItem<TNode>[]
  clear(): void
}
export function TreeSelectTrigger<TNode = unknown>(props: { children(state: TreeSelectTriggerState<TNode>): JSX.Element }) {
  const context = useTreeSelect<TNode>()
  const inputProps = {
    get readOnly() { return !context.searchable() },
    get value() {
      const text = context.snapshot().selectedItems.map((item) => item.label).join(', ')
      return context.snapshot().multiple ? context.searchValue() : context.searchable() && context.searchValue() ? context.searchValue() : text
    },
    onInput: (event: InputEvent & { currentTarget: HTMLInputElement }) => context.setSearchValue(event.currentTarget.value),
    onFocus: context.openPanel,
    onClick: context.openPanel,
  }
  return <PopoverTrigger>{(trigger) => props.children({
    trigger,
    inputProps,
    get selectedItems() { return context.snapshot().selectedItems },
    clear() { context.controller.clear(); context.setSearchValue('') },
  })}</PopoverTrigger>
}
export function TreeSelectContent(props: Parameters<typeof PopoverContent>[0]) {
  return <PopoverPortal><PopoverContent {...props} /></PopoverPortal>
}
export function TreeSelectOption<TNode = unknown>(props: { item: TreeSelectItem<TNode>; toggle?: boolean; closeOnSelect?: boolean; clearSearchOnSelect?: boolean; children(state: { selected: boolean; select(): void }): JSX.Element }) {
  const context = useTreeSelect<TNode>()
  createEffect(() => context.controller.registerItem(props.item))
  const select = () => {
    if (props.item.disabled) return
    if (props.toggle ?? context.snapshot().multiple) context.controller.toggle(props.item)
    else context.controller.select(props.item)
    if (props.clearSearchOnSelect ?? true) context.setSearchValue('')
    const shouldClose = props.closeOnSelect ?? !(props.toggle ?? context.snapshot().multiple)
    if (shouldClose) context.closePanel()
  }
  return props.children({ get selected() { context.snapshot(); return context.controller.isSelected(props.item.value) }, select })
}
export type { TreeSelectItem, TreeSelectValue }
