# Tree primitive

Svelte Tree 是 `@fex/components-core` Tree controller 的 store/组件适配层，不隐式安装任何 feature。

## 导入

```svelte
<script lang="ts">
  import { expansionFeature } from '@fex/components-core'
  import {
    TreeItem, TreeRoot, TreeTitle, TreeTrigger, TreeViewport, createTreeStore,
  } from '@fex/components-svelte/primitive/tree'
</script>
```

DnD action 独立入口：

```ts
import { treeDndItem } from '@fex/components-svelte/primitive/tree/tree-dnd-item'
```

## 基本组合

```svelte
<TreeRoot options={{ treeData, fieldNames, features: [expansionFeature()] }}>
  {#snippet children(tree)}
    <TreeViewport>
      {#snippet children(item)}
        <TreeItem itemKey={item.key}>
          {#snippet children(state)}
            <div {...state.itemProps}>
              <TreeTrigger itemKey={item.key} />
              <TreeTitle>{item.node.name}</TreeTitle>
            </div>
          {/snippet}
        </TreeItem>
      {/snippet}
    </TreeViewport>
  {/snippet}
</TreeRoot>
```

## TreeRoot props

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `options` | `TreeOptions<TNode>` | - | 无 controller 时是 | 创建和更新内部 controller。 |
| `controller` | `TreeController<TNode>` | - | 否 | 使用外部 controller。 |
| `indent` | `number` | `16` | 否 | 缩进与 DnD 指示器计算基准。 |
| `rowHeight` | `number` | `32` | 否 | 行高和虚拟尺寸估算。 |
| `children` | `Snippet<[TreeController]>` | - | 否 | 自定义 DOM。 |
| `class` / `style` | Svelte 原生属性 | - | 否 | 合并到根元素。 |

## 逻辑层与部件

| API | 说明 |
| --- | --- |
| `createTreeStore(options, controller?)` | 返回 controller、snapshot store、visibleItems store 和节点 store 工厂。 |
| `TreeViewport` | 订阅并渲染可见列表。 |
| `TreeVirtualViewport` | 使用 `@tanstack/svelte-virtual`，组件方法支持 `scrollToKey`。 |
| `TreeItem` | snippet 暴露节点状态、ARIA props 和 actions。 |
| `TreeTrigger` | 点击加载、展开和折叠。 |
| `TreeTitle` | title 的最小结构。 |

## 受控状态与回调

| 受控值 | 非受控初值 | 回调 |
| --- | --- | --- |
| `expandedKeys` | `defaultExpandedKeys` | `onExpandedKeysChange` |
| `selectedKeys` | `defaultSelectedKeys` | `onSelectedKeysChange` |
| `checkedKeys` | `defaultCheckedKeys` | `onCheckedKeysChange` |
| `focusedKey` | `defaultFocusedKey` | `onFocusedKeyChange` |

选择默认单选，多选由 selection feature 显式开启。展开、选择、勾选、焦点、键盘、异步加载、搜索、DnD 均按 feature 注册。`fieldNames` 直接读取后端字段，`isLeaf` 可基于额外字段判断潜在子节点。

搜索 feature 只提供命中项和祖先链组成的树数据；原树 CSS 显隐、关键字高亮和 title DOM 由调用方决定。结构 CRUD 是 controller 基础能力，通过 `onTreeDataChange` 返回新树，而不是 feature。

## 注意事项

- key 必须稳定且唯一。
- `TreeVirtualViewport` 只把 core 的可见索引交给 TanStack Virtual。
- DnD action 的 style 要与 TreeItem 的 style 合并。
- checkbox、loading、搜索输入和业务 title 由 UI 组合层提供。
