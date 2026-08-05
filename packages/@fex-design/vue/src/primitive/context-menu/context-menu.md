# ContextMenu

Vue ContextMenu 是右键菜单 primitive。它复用 core 的浮层状态、dismiss 和 virtual reference 定位；Vue 适配层只负责 provide/inject、slot props、Teleport 和 DOM 事件绑定。

## 导入

```ts
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuTrigger,
} from '@fex-design/vue/primitive/context-menu'
```

## 基础用法

```vue
<ContextMenuRoot @open-change="handleOpenChange">
  <ContextMenuTrigger payload="panel" v-slot="trigger">
    <div v-bind="trigger.props" tabindex="0">
      Right click this panel
    </div>
  </ContextMenuTrigger>

  <ContextMenuPortal>
    <ContextMenuContent>
      <ContextMenuItem @click="openPanel">Open</ContextMenuItem>
      <ContextMenuItem @click="renamePanel">Rename</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenuPortal>
</ContextMenuRoot>
```

## Root props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `open` | `boolean` | - | 受控打开状态。 |
| `defaultOpen` | `boolean` | `false` | 非受控初始打开状态。 |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `right` | 默认从鼠标坐标向哪个方向展开。 |
| `align` | `'start' \| 'center' \| 'end'` | `start` | 浮层对齐方式。 |
| `sideOffset` | `number` | `2` | 菜单与右键坐标的主轴距离。 |
| `getPopupContainer` | `(reference) => HTMLElement` | `document.body` | Teleport 挂载容器。 |

## 事件

| 事件 | 类型 | 说明 |
| --- | --- | --- |
| `open-change` | `(open, info) => void` | 打开状态变化。info 包含 `payload`、`target`、`clientX`、`clientY` 和 reason。 |

## Trigger slot

`ContextMenuTrigger` 不创建额外 DOM，而是通过 slot 暴露：

| 字段 | 说明 |
| --- | --- |
| `props` | 需要绑定到调用方元素的右键、键盘、ARIA 与 data-state props。 |
| `ref` | 可显式绑定的元素注册函数；通常 `v-bind="props"` 已包含 ref。 |
| `state` | core snapshot，包含当前 target 和 overlay 状态。 |

## 组合方式

- Tree 节点右键：把 `trigger.props` 合并到已有 Tree row 上，不要在 TreeItem 外层再包一层元素，避免破坏缩进、行高和虚拟列表结构。
- DataTable 表头右键：每个 `th` 绑定不同 payload，例如 `column:id`。
- DataTable 行右键：每个 `tr` 绑定行 id，菜单内容通过 `open-change` 或 snapshot 读取目标上下文。
- 键盘菜单：Trigger 内置 `Shift + F10` 和 `ContextMenu` 键，定位到元素左下角。

## 注意事项

- ContextMenu 使用鼠标坐标创建 virtual reference，菜单不会按整行或整块元素边缘定位。
- 菜单项点击后 `ContextMenuItem` 会关闭当前菜单；如需阻止关闭，在点击事件中调用 `event.preventDefault()`。
- 自定义内容可以直接放在 `ContextMenuContent` 内；菜单项结构可复用 Menu primitive 或业务自己的 DOM。
