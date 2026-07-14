# Tree primitive

Angular Tree 是 `@fex/components-core` controller 的 Signal-first primitive。它不隐式安装 feature，也没有发布 `ui/tree`。

## 导入

```ts
import { expansionFeature } from '@fex/components-core/tree/features/expansion'
import { selectionFeature } from '@fex/components-core/tree/features/selection'
import {
  TreeItemDirective,
  TreeRoot,
  TreeTitleDirective,
  TreeTriggerDirective,
  TreeViewport,
  createTreeSignals,
} from '@fex/components-angular/primitive/tree'
```

DnD directive 独立入口：

```ts
import { TreeDndItemDirective } from '@fex/components-angular/primitive/tree/tree-dnd-item'
```

## 基本组合

```html
<fex-tree [options]="options">
  <fex-tree-viewport>
    <ng-template let-item>
      <div [fexTreeItem]="item.key">
        <button fexTreeTrigger></button>
        <span fexTreeTitle>{{ item.node.name }}</span>
      </div>
    </ng-template>
  </fex-tree-viewport>
</fex-tree>
```

## TreeRoot inputs

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `options` | `TreeOptions<TNode>` | - | 无 controller 时是 | 创建或更新内部 controller。 |
| `controller` | `TreeController<TNode>` | - | 否 | 使用外部 controller。 |
| `indent` | `number` | `16` | 否 | 每层缩进与 DnD 计算基准。 |
| `rowHeight` | `number` | `32` | 否 | 行高与虚拟尺寸估算。 |
| `class` | 原生 class | - | 否 | 自动与根元素默认 class 合并。 |

## 逻辑层与部件

| API | 说明 |
| --- | --- |
| `createTreeSignals(getOptions, controller?)` | 返回 controller、snapshot signal 和 visibleItems signal，供自定义 DOM 使用。 |
| `TreeViewport` | 通过 `ng-template` 输出普通可见列表。 |
| `TreeVirtualViewport` | 使用 `@tanstack/angular-virtual`，实例方法支持 `scrollToKey`。 |
| `TreeItemDirective` | 节点级订阅，提供 ARIA、状态 signal 和 actions。 |
| `TreeTriggerDirective` | 事件驱动的异步加载、展开和折叠。 |
| `TreeTitleDirective` | 最小 title 样式协议。 |
| `TreeDndItemDirective` | 可选拖拽、预览与深度指示器。 |

## 受控状态与回调

| 受控值 | 非受控初值 | 回调 |
| --- | --- | --- |
| `expandedKeys` | `defaultExpandedKeys` | `onExpandedKeysChange` |
| `selectedKeys` | `defaultSelectedKeys` | `onSelectedKeysChange` |
| `checkedKeys` | `defaultCheckedKeys` | `onCheckedKeysChange` |
| `focusedKey` | `defaultFocusedKey` | `onFocusedKeyChange` |

选择默认单选；多选必须显式注册 selection feature 的 multiple 配置。展开、选择、勾选、焦点、键盘、异步加载、搜索和 DnD 都由调用方加入 `features`，core 会校验依赖与冲突。

`fieldNames` 不转换后端大树，直接映射 key/title/children/isLeaf/disabled；`isLeaf` 回调可表达尚未加载 children 的节点。搜索只返回结构共享的过滤数据，DOM 显隐、高亮和 title 模板属于调用方。结构增删改移是 controller 固有能力，并用 `onTreeDataChange` 返回不可变结果。

## 注意事项

- key 必须稳定唯一。
- `createTreeSignals` 应在 Angular 注入上下文中调用，以便自动清理 core subscription。
- 虚拟列表不进入 core；core 只暴露可见列表和索引。
- checkbox、spinner、搜索输入和 title 模板由 UI 组合层负责。
