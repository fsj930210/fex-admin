# Floating 设计手册

`floating/` 负责把参考元素和浮层元素之间的定位关系计算出来。它只处理定位，不处理 open/close、不处理弹层层级、不处理焦点陷阱，也不绑定任何框架响应式。

## 核心流程

```txt
adapter 注册 reference/floating/arrow DOM
  ↓
createFloating.update()
  ↓
Floating UI computePosition(reference, floating)
  ↓
middleware 依次处理 offset / flip / shift / size / arrow / hide
  ↓
写入 CSS 变量和 data-side/data-placement
  ↓
更新 FloatingSnapshot
  ↓
adapter 订阅 snapshot 后刷新框架视图
```

## 为什么使用 `@floating-ui/dom`

这里选择 `@floating-ui/dom`，而不是 `@floating-ui/react` 或自己用 `getBoundingClientRect` 计算。

使用 `@floating-ui/dom` 的原因：

- core 是跨框架层，不能依赖 React 专属 hook。
- `computePosition` 输入 DOM 或 VirtualElement，输出 `x/y/placement/strategy/middlewareData`，正好是 core 需要沉淀的框架无关协议。
- middleware 模型可以稳定组合 `offset`、`flip`、`shift`、`size`、`arrow`、`hide`，后续 Popover、Tooltip、Dropdown、ContextMenu 可以共享同一套行为。

不选择 `@floating-ui/react` 的原因：

- 它会把定位生命周期绑定到 React，Vue/Solid/Svelte/Angular 仍然要重复写一套定位逻辑。
- React adapter 正常不代表其他框架正常，容易再次出现“React 可以，其他框架不可以”的分叉。

不自己计算的原因：

- 简单的 `getBoundingClientRect` 只能覆盖理想场景。
- 滚动容器、视口边界、碰撞翻转、尺寸裁剪、箭头坐标、virtual reference、transform containing block 都会让自研定位迅速变复杂。
- 这些问题一旦分散到各框架 adapter，排查成本会非常高。

## Middleware 选择

```txt
offset
  ↓
flip
  ↓
shift
  ↓
size
  ↓
arrow
  ↓
hide
```

- `offset`：处理主轴和交叉轴偏移，承接 `sideOffset`、`alignOffset`、`offset`。
- `flip`：空间不足时在相反方向兜底，尊重用户的首选 placement。
- `shift`：在不改变主要方向的前提下，把浮层拉回可视区域。
- `size`：输出可用宽高和参考元素尺寸，供样式层做最大尺寸或匹配 trigger 宽度。
- `arrow`：计算箭头在浮层内部的 x/y 坐标。
- `hide`：判断 reference 是否被裁剪或浮层是否逃逸边界。

没有默认使用 `autoPlacement`，因为 `placement` 是用户对组件方向的明确意图。`autoPlacement` 会主动寻找“空间最大”的方向，容易让用户传入的方向失去语义。当前策略是先尊重用户方向，再通过 `flip` 做空间不足时的有限兜底。

## Snapshot 和 DOM 的分工

`FloatingSnapshot` 只保留跨框架需要读取的语义状态：

```txt
placement
side
align
referenceHidden
escaped
```

坐标、尺寸、箭头坐标通过 CSS 变量写到 DOM：

```txt
--floating-x
--floating-y
--floating-strategy
--floating-arrow-x
--floating-arrow-y
--floating-reference-width
--floating-reference-height
```

这样做是为了减少 adapter 的重复工作。各框架只需要把 content 的 `position/left/top/transform-origin` 绑定到 CSS 变量，不需要在模板里重复拼接定位样式。

## 常见 bug

### 箭头方向错

如果发生 `flip`，最终方向可能已经从 `bottom` 变成 `top`。adapter 必须使用 `FloatingSnapshot.side` 或 DOM 上的 `data-side`，不能继续使用 props 里的原始 `placement`。

错误表现：

```txt
console 中 Floating UI result.placement 正确
content 位置正确
arrow 方向还是旧方向
```

### Vue 里 console 正确但 DOM 旧

Vue adapter 不能提前解构 `snapshot.value`。应在 `computed` getter 里读取 `snapshot.value.side`，让模板绑定建立响应式依赖。

### Solid 面板打不开

Solid adapter 不能把 snapshot 读成普通值。应保持访问器函数，例如 `snapshot().open`，否则只会初始化读取一次，后续 store 通知不会触发模板重新计算。

### 异步定位结果覆盖新 DOM

`computePosition` 是异步的。更新期间 reference 或 floating 可能已经被替换，所以 `createFloating` 使用 `updateVersion` 在结果返回后校验当前 DOM 是否仍然是发起计算时的 DOM。没有这层校验时，旧浮层的计算结果可能写到新浮层上。
