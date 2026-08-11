import { asyncLoadFeature, checkFeature, expansionFeature, selectionFeature } from '@fex-design/core'
import type { TreeItem, TreeKey } from '@fex-design/core/tree/types'
import type { TreeSelectItem, TreeSelectValue } from '@fex-design/core/tree-select/types'
import { InputClear, InputControl, InputRoot, type InputRootProps } from '@fex-design/react/primitive/input'
import { TreeSelectContent, TreeSelectOption, TreeSelectRoot, TreeSelectTrigger, useTreeSelect } from '@fex-design/react/primitive/tree-select'
import { Checkbox } from '@fex-design/react/ui/checkbox'
import { treeSelectTagClassName, treeSelectTagOverflowClassName, treeSelectTagRemoveClassName } from '@fex-design/styles/select'
import { CloseIcon } from '@fex-design/react/icon/close'
import { cn } from '@fex/utils'
import type { ReactNode } from 'react'
import { DemoTree } from '../Tree/demo-tree'
import { highlightTreeTitle } from '../Tree/highlight-tree-title'
import { departmentFieldNames, isDepartmentLeaf, type DepartmentNode } from '../Tree/data'

interface Props {
  treeData: readonly DepartmentNode[]
  value?: TreeSelectValue | readonly TreeSelectValue[] | undefined
  defaultValue?: TreeSelectValue | readonly TreeSelectValue[] | undefined
  multiple?: boolean | undefined
  checkStrictly?: boolean | undefined
  maxTagCount?: number | undefined
  searchable?: boolean | undefined
  searchValue?: string | undefined
  onSearchValueChange?: ((value: string) => void) | undefined
  onChange?: ((value: TreeSelectValue | TreeSelectValue[] | undefined) => void) | undefined
  onClear?: (() => void) | undefined
  children?: ReactNode | undefined
  expandedKeys?: readonly TreeKey[] | undefined
  onExpandedKeysChange?: ((keys: readonly TreeKey[]) => void) | undefined
  asyncLoader?: ((item: TreeItem<DepartmentNode>, context: { signal: AbortSignal }) => Promise<readonly DepartmentNode[]>) | undefined
  onTreeDataChange?: ((treeData: readonly DepartmentNode[]) => void) | undefined
  locatedTreeData?: readonly DepartmentNode[] | undefined
  locatedExpandedKeys?: readonly TreeKey[] | undefined
}

function toItems(nodes: readonly DepartmentNode[]): TreeSelectItem<DepartmentNode>[] {
  return nodes.flatMap((node) => [
    { value: node.id, label: node.name, node },
    ...toItems(node.childrenList ?? []),
  ])
}

function TreeSelectPanelState({ children }: { children: (selectedKeys: readonly TreeSelectValue[], setCheckedKeys: (keys: readonly TreeSelectValue[]) => void) => ReactNode }) {
  const { controller, snapshot } = useTreeSelect<DepartmentNode>()
  return children(snapshot.values, controller.setValues)
}

function SelectedTags({ maxTagCount }: { maxTagCount: number }) {
  const treeSelect = useTreeSelect<DepartmentNode>()
  const items = treeSelect.snapshot.selectedItems
  if (items.length > maxTagCount) return <span className={cn(treeSelectTagOverflowClassName, 'ml-1.5')}>已选择 {items.length} 项</span>
  return <>{items.map((item) => <span key={item.value} className={cn(treeSelectTagClassName, 'ml-1.5')}>{item.label}<button type="button" aria-label={`删除 ${item.label}`} className={treeSelectTagRemoveClassName} onPointerDown={(event) => event.preventDefault()} onClick={(event) => { event.stopPropagation(); treeSelect.controller.setValues(treeSelect.snapshot.values.filter((value) => value !== item.value)) }}><CloseIcon /></button></span>)}</>
}

export function DemoTreeSelect({ treeData, value, defaultValue, multiple, checkStrictly, maxTagCount = 2, searchable, searchValue, onSearchValueChange, onChange, onClear, children, expandedKeys, onExpandedKeysChange, asyncLoader, onTreeDataChange, locatedTreeData, locatedExpandedKeys }: Props) {
  const renderTree = (
    data: readonly DepartmentNode[],
    treeExpandedKeys: readonly TreeKey[] | undefined,
    selectedKeys: readonly TreeSelectValue[],
    setCheckedKeys: (keys: readonly TreeSelectValue[]) => void,
    onTreeExpandedKeysChange?: (keys: readonly TreeKey[]) => void,
    useAsyncLoader = false,
  ) => (
    <DemoTree
      treeData={data}
      fieldNames={departmentFieldNames}
      isLeaf={isDepartmentLeaf}
      selectedKeys={multiple ? [] : selectedKeys}
      checkedKeys={multiple ? selectedKeys : undefined}
      onCheckedKeysChange={multiple ? (keys, meta) => {
        if (!checkStrictly) { setCheckedKeys(keys); return }
        const next = new Set(selectedKeys)
        meta.changedKeys.forEach((key) => keys.includes(key) ? next.add(key) : next.delete(key))
        setCheckedKeys([...next])
      } : undefined}
      checkable={multiple}
      expandedKeys={treeExpandedKeys}
      onExpandedKeysChange={onTreeExpandedKeysChange}
      onTreeDataChange={useAsyncLoader ? onTreeDataChange : undefined}
      itemClassName="cursor-pointer data-[disabled=true]:cursor-not-allowed"
      searchKeyword={searchValue ?? ''}
      titleRender={({ item, searchKeyword: keyword }) => highlightTreeTitle(item.node.name, keyword)}
      features={[
        expansionFeature<DepartmentNode>(
          treeExpandedKeys === undefined
            ? { defaultExpandedKeys: ['company', 'engineering', 'finance', 'product'] }
            : {},
        ),
        ...(useAsyncLoader && asyncLoader ? [asyncLoadFeature<DepartmentNode>({ loadChildren: asyncLoader })] : []),
        ...(multiple ? [checkFeature<DepartmentNode>({ mode: checkStrictly ? 'strict' : 'cascade' })] : [selectionFeature<DepartmentNode>()]),
      ]}
      renderItem={({ item, defaultNode, itemProps, leadingNode, titleNode, checkedState, actions }) => {
        if (multiple) {
          return (
            <div
              {...itemProps}
              className={cn(itemProps.className, 'cursor-pointer data-[disabled=true]:cursor-not-allowed')}
              onClick={(event) => {
                event.stopPropagation()
                actions.toggleChecked()
              }}
            >
              {leadingNode}
              <Checkbox
                checked={checkedState}
                disabled={item.disabled}
                tabIndex={-1}
                onClick={(event) => event.stopPropagation()}
                onCheckedChange={() => actions.toggleChecked()}
              />
              {titleNode}
            </div>
          )
        }
        const option: TreeSelectItem<DepartmentNode> = { value: item.key, label: item.node.name, node: item.node, disabled: item.disabled }
        return (
          <TreeSelectOption item={option}>
            {({ selected, select }) => (
              <div
                {...itemProps}
                data-selected={!multiple && selected ? true : undefined}
                data-disabled={item.disabled || undefined}
                className={cn(itemProps.className, 'cursor-pointer data-[selected]:bg-accent data-[disabled]:cursor-not-allowed')}
                onClick={(event) => {
                  event.stopPropagation()
                  itemProps.onClick?.(event)
                  select()
                }}
              >
                {leadingNode}
                {multiple ? <Checkbox checked={selected} tabIndex={-1} /> : null}
                {titleNode}
              </div>
            )}
          </TreeSelectOption>
        )
      }}
    />
  )
  return (
    <TreeSelectRoot<DepartmentNode>
      items={toItems(treeData)}
      {...(value === undefined && onChange === undefined ? {} : { value })}
      defaultValue={defaultValue}
      multiple={multiple}
      searchable={searchable}
      searchValue={searchValue}
      onSearchValueChange={onSearchValueChange}
      onChange={(next) => {
        onChange?.(next)
      }}
    >
      <TreeSelectTrigger<DepartmentNode>>
        {({ triggerProps, inputProps, clear, selectedItems }) => (
          <InputRoot
            {...(triggerProps as unknown as InputRootProps)}
            ref={triggerProps.ref as never}
            value={inputProps.value}
            onClear={() => {
              clear()
              onClear?.()
            }}
            className="w-80"
          >
            {multiple ? <SelectedTags maxTagCount={maxTagCount} /> : null}
            <InputControl
              readOnly={inputProps.readOnly}
              placeholder={selectedItems.length ? undefined : searchable ? '搜索部门' : '请选择部门'}
              onChange={inputProps.onChange}
              onFocus={inputProps.onFocus}
              onClick={inputProps.onClick}
            />
            <InputClear
              forceMount={selectedItems.length > 0 || Boolean(searchValue)}
              aria-label="清除"
              onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
                clear()
                onClear?.()
              }}
            />
          </InputRoot>
        )}
      </TreeSelectTrigger>
      <TreeSelectContent className="w-80 p-space-sm">
        <TreeSelectPanelState>
          {(selectedKeys, setCheckedKeys) => (
            <>
              {children}
              {locatedTreeData ? renderTree(locatedTreeData, locatedExpandedKeys, selectedKeys, setCheckedKeys) : null}
              <div className={children || locatedTreeData ? 'hidden' : undefined}>
                {renderTree(treeData, expandedKeys, selectedKeys, setCheckedKeys, onExpandedKeysChange, true)}
              </div>
            </>
          )}
        </TreeSelectPanelState>
      </TreeSelectContent>
    </TreeSelectRoot>
  )
}
