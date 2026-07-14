# Tree primitive

Vue Tree 是 `@fex/components-core` Tree controller 的无样式适配层。组件不会隐式安装任何 feature；调用方只引入并注册实际使用的 feature。

## 导入

```ts
import { expansionFeature, selectionFeature } from '@fex/components-core'
import {
  TreeItem,
  TreeRoot,
  TreeTitle,
  TreeTrigger,
  TreeViewport,
  TreeVirtualViewport,
  useTree,
  useTreeItem,
  useTreeVisibleItems,
} from '@fex/components-vue/primitive/tree'
```

DnD 适配器使用独立入口，未导入时不会进入应用包：

```ts
import { useTreeDndItem } from '@fex/components-vue/primitive/tree/use-tree-dnd-item'
```

## 基本组合

```vue
<TreeRoot :options="{ treeData, fieldNames, features: [expansionFeature(), selectionFeature()] }" v-slot="{ tree }">
  <TreeViewport v-slot="{ item }">
    <TreeItem :item-key="item.key" v-slot="state">
      <div v-bind="state.itemProps">
        <TreeTrigger :item-key="item.key" />
        <TreeTitle>{{ item.node.name }}</TreeTitle>
      </div>
    </TreeItem>
  </TreeViewport>
</TreeRoot>
```

## TreeRoot props

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `options` | `TreeOptions<TNode>` | - | 无外部 controller 时是 | 创建或更新内部 controller。 |
| `controller` | `TreeController<TNode>` | - | 否 | 使用可脱离 Tree DOM 存活的外部 controller。 |
| `indent` | `number` | `16` | 否 | 每层横向缩进，DnD 使用相同数值计算指示器。 |
| `rowHeight` | `number` | `32` | 否 | 行高及虚拟列表默认尺寸估算。 |
| `class` / `style` | Vue 原生属性 | - | 否 | 显式合并到根元素。 |

`TreeRoot` 透传其余 `div` 属性。传入外部 controller 和 options 时，适配层调用 `controller.updateOptions(options)` 同步框架输入。

## 逻辑层与部件

| API | 说明 |
| --- | --- |
| `useTree(getOptions)` | 创建 controller，并把 Vue 响应式 options 同步到 core。 |
| `useTreeItem(tree, key)` | 只订阅指定节点，返回展开、选择、勾选、焦点和异步加载状态。 |
| `useTreeVisibleItems(tree)` | 订阅独立于虚拟库的可见扁平列表。 |
| `TreeViewport` | 按 `getVisibleItems()` 渲染普通列表。 |
| `TreeVirtualViewport` | 使用 `@tanstack/vue-virtual`，暴露 `scrollToKey(key, { align, reveal })`。 |
| `TreeItem` | slot 暴露 `itemProps`、节点状态和显式 actions。 |
| `TreeTrigger` | 点击时按需加载子节点，再展开或折叠。 |
| `TreeTitle` | 最小标题结构，不规定业务内容。 |

## 状态、回调与 feature

| 受控值 | 非受控初值 | 回调 |
| --- | --- | --- |
| `expandedKeys` | `defaultExpandedKeys` | `onExpandedKeysChange` |
| `selectedKeys` | `defaultSelectedKeys` | `onSelectedKeysChange` |
| `checkedKeys` | `defaultCheckedKeys` | `onCheckedKeysChange` |
| `focusedKey` | `defaultFocusedKey` | `onFocusedKeyChange` |

选择默认单选；多选由 `selectionFeature({ multiple: true })` 开启。勾选可使用 cascade 或 strict。展开、选择、勾选、焦点、键盘、异步加载、搜索和 DnD 都必须显式放入 `features`。feature 依赖、重复注册和冲突由 core 在创建 controller 时校验。

`fieldNames` 直接映射后端 key/title/children/isLeaf/disabled 字段，不转换整棵树。`isLeaf(node)` 可以覆盖字段映射，支持“当前没有 children 但仍可异步展开”的节点。

搜索 feature 只返回包含命中项和祖先链的共享结构数据；是否隐藏原树、是否高亮以及 title 内容由调用方决定。结构增删改移调用 controller 的 `insertNode`、`updateNode`、`removeNode`、`moveNode`、`replaceChildren`，并通过 `onTreeDataChange` 交回不可变数据。

## 注意事项

- key 必须稳定且唯一。
- 虚拟列表只消费 core 的可见索引，不进入 core。
- DnD row 需要合并 TreeItem 与 `useTreeDndItem` 的 style，保留缩进和指示器变量。
- checkbox、loading、搜索输入和 title markup 都属于调用方 UI。
