# Overlay 设计手册

`overlay/` 负责浮层类组件的生命周期和关闭协议。它不负责具体坐标计算，定位统一由一级模块 `floating/` 处理。

## 模块职责

```txt
overlay/
  create-overlay.ts            组合 disclosure、presence、layer、dismiss
  create-floating-overlay.ts   组合 overlay + floating + trigger，服务 Popover 类组件
  types.ts                     overlay 对 adapter 暴露的事件和状态协议
  layer/                       浮层层级栈
  presence/                    挂载、卸载和过渡阶段
  trigger/                     click/hover/focus/contextMenu 触发协议
```

## 为什么不把 floating 放在 overlay 下面

Overlay 和 Floating 是两种不同能力：

- Overlay 关注“是否打开、是否挂载、如何关闭、是否属于某个层级”。
- Floating 关注“reference 和 floating DOM 应该如何定位”。

Popover 同时需要两者；Dialog 通常只需要 overlay；虚拟参考点 ContextMenu 可能主要需要 floating。把 `floating` 放成一级目录，可以让这些组合关系更清楚，也避免后续组件为了定位能力被迫依赖 overlay。

## create-floating-overlay 的定位

`create-floating-overlay` 是一个组合器：

```txt
trigger event
  ↓
trigger 请求 open/close
  ↓
overlay 更新 open/mounted/phase
  ↓
content 挂载后 floating 计算位置
  ↓
组合后的 snapshot 通知 adapter
```

它适合 Popover、Tooltip、Dropdown、HoverCard、ContextMenu 这类“触发器 + 浮动内容 + 关闭行为”的组件。

如果未来组件只有其中一部分能力，应直接组合底层模块：

- 只要开关状态：使用 `disclosure/create-disclosure`
- 要浮层关闭和层级：使用 `overlay/create-overlay`
- 只要 DOM 定位：使用 `floating/create-floating`

## Adapter 排查顺序

当某个框架行为不一致时，不要直接 patch adapter。先确认：

```txt
overlay snapshot.open/mounted/phase 是否正确
  ↓
floating snapshot.side/placement 是否正确
  ↓
adapter 是否订阅到了组合 snapshot
  ↓
adapter 是否把最终 snapshot 绑定到 DOM
```

例如箭头方向错，通常不是 trigger 或 disclosure 问题，而是 adapter 使用了原始 props placement，没有使用 floating 计算后的最终 side。
