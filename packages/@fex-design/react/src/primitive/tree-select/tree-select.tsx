import { createTreeSelectController } from '@fex-design/core/tree-select/create-tree-select-controller'
import type {
  TreeSelectController,
  TreeSelectItem,
  TreeSelectOptions,
  TreeSelectValue,
} from '@fex-design/core/tree-select/types'
import type { ComponentProps, ChangeEvent, ReactNode } from 'react'
import { useRef, useState } from 'react'
import { useCoreStore } from '../../hooks/use-core-store'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  type PopoverRootProps,
  type PopoverTriggerRenderProps,
} from '../popover/popover'
import { TreeSelectContext, useTreeSelect } from './tree-select-context'

export interface TreeSelectRootProps<TNode = unknown>
  extends TreeSelectOptions<TNode>,
    Omit<PopoverRootProps, 'children'> {
  controller?: TreeSelectController<TNode> | undefined
  children?: ReactNode
  searchable?: boolean | undefined
  searchValue?: string | undefined
  defaultSearchValue?: string | undefined
  onSearchValueChange?: ((value: string) => void) | undefined
}

export function TreeSelectRoot<TNode = unknown>(props: TreeSelectRootProps<TNode>) {
  const optionsRef = useRef(props)
  optionsRef.current = props
  const controllerRef = useRef<TreeSelectController<TNode> | null>(null)
  controllerRef.current ??= createTreeSelectController({
    get value() { return optionsRef.current.value },
    get defaultValue() { return optionsRef.current.defaultValue },
    get multiple() { return optionsRef.current.multiple },
    get disabled() { return optionsRef.current.disabled },
    onChange: (value, meta) => optionsRef.current.onChange?.(value, meta),
  })
  const controller = props.controller ?? controllerRef.current
  const snapshot = useCoreStore(controller)
  useIsomorphicLayoutEffect(() => controller.updateOptions(props), [controller, props])
  const uncontrolledSearchRef = useRef(props.defaultSearchValue ?? '')
  const searchValue = props.searchValue ?? uncontrolledSearchRef.current
  const [uncontrolledOpen, setUncontrolledOpen] = useState(props.defaultOpen ?? false)
  const open = props.open ?? uncontrolledOpen
  const setOpen = (nextOpen: boolean, info: Parameters<NonNullable<PopoverRootProps['onOpenChange']>>[1] = { reason: 'manual' }) => {
    if (props.open === undefined) setUncontrolledOpen(nextOpen)
    props.onOpenChange?.(nextOpen, info)
  }
  const setSearchValue = (value: string) => {
    if (props.searchValue === undefined) uncontrolledSearchRef.current = value
    props.onSearchValueChange?.(value)
  }
  const {
    children,
    controller: _controller,
    searchable: _searchable,
    searchValue: _searchValue,
    defaultSearchValue: _defaultSearchValue,
    onSearchValueChange: _onSearchValueChange,
    open: _open,
    defaultOpen: _defaultOpen,
    onOpenChange: _onOpenChange,
    closeDelay,
    trigger,
    value: _value,
    defaultValue: _defaultValue,
    multiple: _multiple,
    onChange: _onChange,
    ...popoverProps
  } = props
  return (
    <TreeSelectContext
      value={{ controller, snapshot, searchable: props.searchable === true, searchValue, setSearchValue, openPanel: () => setOpen(true), closePanel: () => setOpen(false) }}
    >
      <PopoverRoot
        {...popoverProps}
        trigger={trigger ?? []}
        closeDelay={closeDelay ?? 0}
        open={open}
        onOpenChange={setOpen}
        disabled={props.disabled}
      >
        {children}
      </PopoverRoot>
    </TreeSelectContext>
  )
}

export interface TreeSelectTriggerState<TNode = unknown> {
  triggerProps: PopoverTriggerRenderProps
  inputProps: {
    readOnly: boolean
    value: string
    onChange(event: ChangeEvent<HTMLInputElement>): void
    onFocus(): void
    onClick(): void
  }
  selectedItems: readonly TreeSelectItem<TNode>[]
  clear(): void
}

export interface TreeSelectTriggerProps<TNode = unknown> {
  children(state: TreeSelectTriggerState<TNode>): ReactNode
  displayValue?: ((items: readonly TreeSelectItem<TNode>[]) => string) | undefined
}

export function TreeSelectTrigger<TNode = unknown>({ children, displayValue }: TreeSelectTriggerProps<TNode>) {
  const treeSelect = useTreeSelect<TNode>()
  const selectedText = displayValue
    ? displayValue(treeSelect.snapshot.selectedItems)
    : treeSelect.snapshot.selectedItems.map((item) => item.label).join(', ')
  return (
    <PopoverTrigger>
      {(triggerProps) => children({
        triggerProps,
        inputProps: {
          readOnly: !treeSelect.searchable,
          value: treeSelect.snapshot.multiple ? treeSelect.searchValue : treeSelect.searchable && treeSelect.searchValue ? treeSelect.searchValue : selectedText,
          onChange: (event) => treeSelect.setSearchValue(event.currentTarget.value),
          onFocus: treeSelect.openPanel,
          onClick: treeSelect.openPanel,
        },
        selectedItems: treeSelect.snapshot.selectedItems,
        clear: () => {
          treeSelect.controller.clear()
          treeSelect.setSearchValue('')
        },
      })}
    </PopoverTrigger>
  )
}

export interface TreeSelectContentProps extends ComponentProps<typeof PopoverContent> {
  container?: HTMLElement | null | undefined
  forceMount?: boolean | undefined
}

export function TreeSelectContent({ container, forceMount, ...props }: TreeSelectContentProps) {
  return <PopoverPortal {...(container === undefined ? {} : { container })} {...(forceMount === undefined ? {} : { forceMount })}><PopoverContent {...props} /></PopoverPortal>
}

export interface TreeSelectOptionProps<TNode = unknown> {
  item: TreeSelectItem<TNode>
  toggle?: boolean | undefined
  closeOnSelect?: boolean | undefined
  clearSearchOnSelect?: boolean | undefined
  children(state: { selected: boolean; select(): void }): ReactNode
}

export function TreeSelectOption<TNode = unknown>({ item, toggle, closeOnSelect, clearSearchOnSelect = true, children }: TreeSelectOptionProps<TNode>) {
  const treeSelect = useTreeSelect<TNode>()
  useIsomorphicLayoutEffect(() => treeSelect.controller.registerItem(item), [treeSelect.controller, item])
  const select = () => {
    if (item.disabled) return
    if (toggle ?? treeSelect.snapshot.multiple) treeSelect.controller.toggle(item)
    else treeSelect.controller.select(item)
    if (clearSearchOnSelect) treeSelect.setSearchValue('')
    const shouldClose = closeOnSelect ?? !(toggle ?? treeSelect.snapshot.multiple)
    if (shouldClose) treeSelect.closePanel()
  }
  return children({ selected: treeSelect.controller.isSelected(item.value), select })
}

export type { TreeSelectItem, TreeSelectValue }
export { useTreeSelect } from './tree-select-context'
