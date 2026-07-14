import type {
  TreeController,
  TreeItem as CoreTreeItem,
  TreeNodeData,
  TreeOptions,
  TreeVisibleItem,
} from '@fex/components-core/tree/types'
import {
  TreeItem,
  TreeRoot,
  TreeTitle,
  TreeTrigger,
  TreeVirtualViewport,
  TreeViewport,
} from '@fex/components-react/primitive/tree'
import type { TreeVirtualViewportHandle } from '@fex/components-react/primitive/tree'
import { Checkbox } from '@fex/components-react/ui/checkbox'
import { Spinner } from '@fex/components-react/ui/spinner'
import { cn } from '@fex/utils'
import type { ReactNode, Ref } from 'react'

export type { TreeVirtualViewportHandle } from '@fex/components-react/primitive/tree'

interface DemoTreeTitleRenderContext<TNode extends TreeNodeData> {
  item: CoreTreeItem<TNode>
  tree: TreeController<TNode>
  isSearching: boolean
  searchKeyword: string
}

interface DemoTreeRenderItemContext<TNode extends TreeNodeData>
  extends DemoTreeTitleRenderContext<TNode> {
  defaultNode: ReactNode
}

interface DemoTreeProps<TNode extends TreeNodeData> extends TreeOptions<TNode> {
  controller?: TreeController<TNode> | undefined
  checkable?: boolean | undefined
  virtual?: boolean | undefined
  height?: number | undefined
  overscan?: number | undefined
  indent?: number | undefined
  searchKeyword?: string | undefined
  titleRender?: ((context: DemoTreeTitleRenderContext<TNode>) => ReactNode) | undefined
  renderItem?: ((context: DemoTreeRenderItemContext<TNode>) => ReactNode) | undefined
  className?: string | undefined
  itemClassName?: string | undefined
  virtualViewportRef?: Ref<TreeVirtualViewportHandle> | undefined
}

function DemoTreeRow<TNode extends TreeNodeData>({
  tree,
  item,
  checkable,
  titleRender,
  renderItem,
  searchKeyword,
  itemClassName,
  titleField,
}: {
  tree: TreeController<TNode>
  item: TreeVisibleItem<TNode>
  checkable: boolean
  titleRender?: DemoTreeProps<TNode>['titleRender']
  renderItem?: DemoTreeProps<TNode>['renderItem']
  searchKeyword: string
  itemClassName?: string | undefined
  titleField: string
}) {
  return (
    <TreeItem<TNode> itemKey={item.key} className={itemClassName}>
      {({ item: currentItem, itemProps, checkedState, loadState, actions }) => {
        const titleContext: DemoTreeTitleRenderContext<TNode> = {
          item: currentItem,
          tree,
          isSearching: Boolean(searchKeyword),
          searchKeyword,
        }
        const defaultNode = (
          <div {...itemProps}>
            {loadState === 'loading' ? (
              <Spinner size="sm" aria-label="Loading children" />
            ) : (
              <TreeTrigger<TNode> itemKey={currentItem.key} />
            )}
            {checkable && tree.hasFeature('check') ? (
              <Checkbox
                checked={checkedState}
                disabled={currentItem.disabled}
                onClick={(event) => event.stopPropagation()}
                onCheckedChange={() => actions.toggleChecked()}
              />
            ) : null}
            <TreeTitle>
              {titleRender?.(titleContext) ?? String(currentItem.node[titleField] ?? currentItem.key)}
            </TreeTitle>
          </div>
        )
        return renderItem?.({ ...titleContext, defaultNode }) ?? defaultNode
      }}
    </TreeItem>
  )
}

export function DemoTree<TNode extends TreeNodeData>({
  controller,
  treeData,
  features,
  fieldNames,
  isLeaf,
  checkMode,
  asyncLoader,
  expandedKeys,
  defaultExpandedKeys,
  onExpandedKeysChange,
  selectedKeys,
  defaultSelectedKeys,
  onSelectedKeysChange,
  checkedKeys,
  defaultCheckedKeys,
  onCheckedKeysChange,
  focusedKey,
  defaultFocusedKey,
  onFocusedKeyChange,
  multiple,
  onTreeDataChange,
  checkable = false,
  virtual = false,
  height = 320,
  overscan,
  indent,
  searchKeyword = '',
  titleRender,
  renderItem,
  className,
  itemClassName,
  virtualViewportRef,
}: DemoTreeProps<TNode>) {
  const titleField = fieldNames?.title ?? 'title'
  const options: TreeOptions<TNode> = {
    treeData,
    ...(features === undefined ? {} : { features }),
    ...(fieldNames === undefined ? {} : { fieldNames }),
    ...(isLeaf === undefined ? {} : { isLeaf }),
    ...(checkMode === undefined ? {} : { checkMode }),
    ...(asyncLoader === undefined ? {} : { asyncLoader }),
    ...(expandedKeys === undefined ? {} : { expandedKeys }),
    ...(defaultExpandedKeys === undefined ? {} : { defaultExpandedKeys }),
    ...(onExpandedKeysChange === undefined ? {} : { onExpandedKeysChange }),
    ...(selectedKeys === undefined ? {} : { selectedKeys }),
    ...(defaultSelectedKeys === undefined ? {} : { defaultSelectedKeys }),
    ...(onSelectedKeysChange === undefined ? {} : { onSelectedKeysChange }),
    ...(checkedKeys === undefined ? {} : { checkedKeys }),
    ...(defaultCheckedKeys === undefined ? {} : { defaultCheckedKeys }),
    ...(onCheckedKeysChange === undefined ? {} : { onCheckedKeysChange }),
    ...(focusedKey === undefined ? {} : { focusedKey }),
    ...(defaultFocusedKey === undefined ? {} : { defaultFocusedKey }),
    ...(onFocusedKeyChange === undefined ? {} : { onFocusedKeyChange }),
    ...(multiple === undefined ? {} : { multiple }),
    ...(onTreeDataChange === undefined ? {} : { onTreeDataChange }),
  }

  return (
    <TreeRoot<TNode>
      controller={controller}
      options={options}
      indent={indent}
      className={cn('w-full', className)}
    >
      {(tree) =>
        virtual ? (
          <TreeVirtualViewport<TNode>
            ref={virtualViewportRef}
            height={height}
            overscan={overscan}
          >
            {(item) => (
              <DemoTreeRow
                key={item.key}
                tree={tree}
                item={item}
                checkable={checkable}
                titleRender={titleRender}
                renderItem={renderItem}
                searchKeyword={searchKeyword}
                itemClassName={itemClassName}
                titleField={titleField}
              />
            )}
          </TreeVirtualViewport>
        ) : (
          <TreeViewport<TNode>>
            {(item) => (
              <DemoTreeRow
                key={item.key}
                tree={tree}
                item={item}
                checkable={checkable}
                titleRender={titleRender}
                renderItem={renderItem}
                searchKeyword={searchKeyword}
                itemClassName={itemClassName}
                titleField={titleField}
              />
            )}
          </TreeViewport>
        )
      }
    </TreeRoot>
  )
}
