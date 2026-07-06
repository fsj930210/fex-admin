# Sortable 设计文档

## 组件定位

`sortable` 是 drag 系列里的排序内核，负责把指针拖拽过程转换成稳定、可复用的排序状态和最终数据结果。

它不依赖 React、Vue、Solid、Svelte 或 Angular，也不直接操作组件树。各框架 adapter 只负责：

- 注册真实 DOM 元素和容器；
- 在用户事件里调用 controller action；
- 订阅 core store 快照来刷新视图；
- 把 core 计算出的样式绑定到 item 和 overlay。

## 设计目标

- **事件驱动**：拖拽开始、移动、结束、取消都由明确 action 触发，不通过 watch/effect 监听业务状态再补逻辑。
- **跨框架一致**：排序命中、占位、动画、数据恢复规则全部在 core 中完成。
- **低重复渲染**：core store 只在 snapshot 语义变化时通知 adapter。
- **数据形态稳定**：输入是数组时输出数组；输入是 record 时输出 record，不让 adapter 自己猜结构。
- **可扩展**：后续网格排序、键盘排序、禁用项、Tree DnD 可以在命中策略和 action 层扩展。

## 核心模块

### `createSortableController`

controller 是唯一的状态入口，外部只能通过 action 改变拖拽状态：

- `startDrag`：开始拖拽，记录 active item、容器、初始指针、初始矩形。
- `updatePointer`：更新指针偏移，计算 overlay、碰撞和预览顺序。
- `endDrag`：提交排序结果，并通过 `onChange` 把恢复后的数据形态交给调用方。
- `cancelDrag`：取消拖拽并清理状态。
- `update`：更新 items、axis、onChange 等 options，不重建 controller。

adapter 不应绕过这些 action 直接修改内部状态。

### Core store

sortable controller 通过 core store 暴露：

- `getSnapshot()`：读取当前快照；
- `subscribe(listener)`：订阅快照变化；
- `setSnapshot/updateSnapshot`：只在 core 内部使用。

订阅只表示“快照变化，需要刷新视图”，不承载业务语义。业务语义必须由 `startDrag/updatePointer/endDrag/cancelDrag` 这类 action 表达。

## 数据流

```text
用户 pointerdown
  -> adapter 注册 DOM 信息并调用 startDrag
  -> core 记录 activeId、containerId、初始 rect

document pointermove
  -> adapter 调用 updatePointer
  -> core 计算 dragOffset、overId、previewItems、motionVersion
  -> store 通知 adapter 刷新样式

document pointerup
  -> adapter 调用 endDrag
  -> core 还原数据形态并触发 onChange
  -> store 清理 dragging 状态
```

这里没有“先改响应式状态，再 watch 状态变化去排序”的链路。排序结果来自拖拽事件本身。

## DOM 与样式职责

core 只保存 DOM rect 快照和计算结果，不直接渲染 DOM。

adapter 必须绑定：

- `getItemStyle(id)`：拖拽中原 item 的隐藏、占位和过渡样式；
- `getMotionStyle(id)`：非 active item 的 FLIP 位移动画；
- `getOverlayStyle()`：拖拽 overlay 的位置、尺寸和指针偏移。

overlay 的真实移动来自 core 维护的 `dragOffset`，adapter 不应该重新计算一套位移。

## Options 更新原则

框架层必须保持 controller 稳定，不要因为 props 或 signal 变化重建实例。

正确方式：

- 用户事件发生前，把最新 options 同步给 controller；
- 或在 render/action update 阶段对 options 做浅比较后调用 `controller.update(options)`；
- 不使用 `useEffect`、`watch`、`createEffect`、`$effect` 专门监听 options 再更新 controller。

这样能避免“组件任意重渲染都同步底层实例”的问题，也能让 options 更新的触发点更清楚。

## 跨框架 adapter 约定

- React：controller 用稳定引用保存；DOM 监听的挂载/卸载用已有生命周期 hook；业务变化走事件回调。
- Vue：组合式函数保存 controller；模板事件调用 action；不使用 `watch/watchEffect` 串联排序流程。
- Solid：primitive 保存 controller；事件前同步最新 props；不使用 `createEffect` 监听 props 做业务同步。
- Svelte：action 负责 DOM 生命周期；action `update` 同步 options；不使用 `$effect` 串联排序流程。
- Angular：directive/service 连接 DOM 与 controller；input 变化用明确生命周期同步；不使用 signal `effect` 补业务流程。

## 常见问题

### 拖拽后顺序没变化

检查 adapter 是否调用了 `endDrag`，以及 `onChange` 是否使用 core 返回的新数据，而不是继续使用旧的外部 items。

### hover 命中不稳定

先检查 DOM 注册、containerId 和 pointer 事件绑定是否正确，不要直接调低命中阈值掩盖问题。

### 原 item 没有隐藏或占位塌陷

检查 adapter 是否绑定了 `getItemStyle(id)`。active item 需要隐藏但保留宽高，避免列表布局塌陷。

### overlay 位置不跟手

检查 `updatePointer` 是否持续触发，以及 overlay 是否绑定 `getOverlayStyle()`。

### 动画不生效

检查 adapter 是否订阅了 snapshot，并在 `motionVersion` 更新后重新读取 `getItemStyle` / `getMotionStyle`。

## 后续扩展

- 网格排序：新增 grid 命中策略，不复用当前线性相邻交换策略硬撑。
- 键盘排序：新增明确 action，例如 `moveActiveBefore`、`moveActiveAfter`，不伪造 pointer 事件。
- 禁用项：在类型和命中层增加 disabled 协议，避免 adapter 单独过滤导致跨框架不一致。
- Tree DnD：在 Tree 层组合 sortable 或独立 dnd 能力，sortable 本身不理解树结构和层级缩进。
