# Tree primitive

Solid Tree 是 `@fex/components-core` Tree controller 的细粒度响应适配层。Tree 不内置 feature，调用方通过 `features` 显式组合所需行为。

## 导入与基本组合

```tsx
import { expansionFeature, selectionFeature } from '@fex/components-core'
import {
  TreeItem, TreeRoot, TreeTitle, TreeTrigger, TreeViewport,
  createTree, createTreeItem, createTreeVisibleItems,
} from '@fex/components-solid/primitive/tree'

<TreeRoot options={{ treeData, fieldNames, features: [expansionFeature(), selectionFeature()] }}>
  {(tree) => <TreeViewport>{(item) => (
    <TreeItem itemKey={item.key}>{(state) => (
      <div {...state.itemProps}>
        <TreeTrigger itemKey={item.key} />
        <TreeTitle>{item.node.name}</TreeTitle>
      </div>
    )}</TreeItem>
  )}</TreeViewport>}
</TreeRoot>
```

DnD 独立入口：

```ts
import { createTreeDndItem } from '@fex/components-solid/primitive/tree/create-tree-dnd-item'
```

## TreeRoot props

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `options` | `TreeOptions<TNode> \| Accessor<TreeOptions<TNode>>` | - | 无 controller 时是 | 创建并更新内部 controller；传入 accessor 时会同步受控状态。 |
| `controller` | `TreeController<TNode>` | - | 否 | 使用外部 controller。 |
| `indent` | `number` | `16` | 否 | 深度缩进和 DnD 计算基准。 |
| `rowHeight` | `number` | `32` | 否 | 行高和虚拟尺寸估算。 |
| `children` | `JSX.Element \| (tree) => JSX.Element` | - | 是 | 内容或 controller render function。 |
| `class` / `style` | Solid 原生属性 | - | 否 | 合并到根节点。 |

## 逻辑层与部件

| API | 说明 |
| --- | --- |
| `createTree(getOptions)` | 创建 controller，并只在 Solid/core 边界同步 options。 |
| `createTreeItem(tree, key)` | 节点级订阅 memo。 |
| `createTreeVisibleItems(tree)` | 可见扁平列表 signal。 |
| `TreeViewport` | 普通可见列表。 |
| `TreeVirtualViewport` | `@tanstack/solid-virtual` 适配；handle 支持 `scrollToKey`。 |
| `TreeItem` | 暴露 ARIA props、状态和 actions。 |
| `TreeTrigger` | 事件驱动的异步加载、展开和折叠。 |
| `TreeTitle` | 自定义 title 的最小结构。 |

## 受控状态与回调

| 受控值 | 非受控初值 | 回调 |
| --- | --- | --- |
| `expandedKeys` | `defaultExpandedKeys` | `onExpandedKeysChange` |
| `selectedKeys` | `defaultSelectedKeys` | `onSelectedKeysChange` |
| `checkedKeys` | `defaultCheckedKeys` | `onCheckedKeysChange` |
| `focusedKey` | `defaultFocusedKey` | `onFocusedKeyChange` |

选择默认单选；`selectionFeature({ multiple: true })` 开启多选。展开、选择、勾选、焦点、键盘、异步加载、搜索和 DnD 均是独立 feature。core 校验 feature 的依赖、冲突和重复注册。

`fieldNames` 映射后端字段而不转换大树；`isLeaf` 支持基于后端元数据判定可展开性。搜索只产生过滤后的共享结构树数据，隐藏策略和高亮由调用方渲染。controller 的 `updateNode`、`insertNode`、`removeNode`、`moveNode` 和 `replaceChildren` 负责不可变结构更新，并触发 `onTreeDataChange`。

## 注意事项

- key 必须稳定唯一，列表使用 item key。
- core 的 `getVisibleItems()` 不依赖虚拟列表库。
- DnD 必须合并 item 与 DnD style。
- checkbox、spinner、搜索输入和 title markup 不属于 primitive 默认结构。
