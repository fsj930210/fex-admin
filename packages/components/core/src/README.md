# Core 设计手册

`@fex/components-core` 只放跨框架共享的状态、协议和纯逻辑。这里的代码会被 React、Vue、Solid、Svelte、Angular 组件共同消费，所以目录边界必须先表达“能力是什么”，再表达“哪个组件在用它”。

## 当前模块边界

```txt
core/src
  store/        通用快照仓库，提供 getSnapshot/subscribe/updateSnapshot
  disclosure/   展开/收起状态，只关心 open/close/toggle
  floating/     浮动定位能力，封装 Floating UI，不关心 open/close
  overlay/      浮层生命周期、层级、触发和关闭行为
  sortable/     拖拽排序能力，负责命中、预览顺序、位移动画和 snapshot
```

## 依赖方向

```txt
Popover / Tooltip / Dropdown
  -> disclosure
  -> overlay
  -> floating

Dialog / Drawer
  -> disclosure
  -> overlay

Tree
  -> tree
  -> collection
  -> selection
  -> roving-focus

DndTree
  -> tree
  -> dnd
  -> collection
  -> selection
```

`floating` 已经是一级模块，不放在 `overlay` 下面。原因是浮动定位不是所有浮层都需要的能力：Popover、Tooltip、Dropdown 需要定位到 trigger；Dialog、Drawer、Toast 通常不需要。把它放成一级能力，可以避免后续 Tree、Menu、Select、ContextMenu 等组件复用定位时被迫依赖 overlay 的生命周期语义。

## Overlay 和 Floating 的关系

```txt
用户事件
  ↓
overlay trigger 判断是否请求打开/关闭
  ↓
disclosure 更新 open
  ↓
overlay 更新 mounted/phase/layer 状态
  ↓
floating 在内容挂载后计算 x/y/placement
  ↓
adapter 把 snapshot 和 CSS 变量绑定到 DOM
```

`overlay/create-floating-overlay` 是组合器，不是新的基础能力。它把 `overlay`、`floating`、`trigger` 串起来，给 Popover 这类“有触发器、有浮动定位、有关闭行为”的组件使用。

后续如果组件只需要定位，例如虚拟参考点菜单，可以直接使用 `floating/create-floating`；如果只需要打开关闭和外部点击关闭，可以使用 `overlay/create-overlay`，不需要引入 Floating UI。

## 后续新增模块怎么放

### Tree

Tree 不放进 overlay。Tree 的核心是树形数据、展开节点、选择节点、禁用节点、扁平化可见节点和键盘导航。它最多复用 `store`、`selection`、`collection`、`roving-focus`，不应该依赖 `floating`。

### DnD

DnD 不放进 tree。拖拽排序、命中检测、drop 规则可以服务 Tree、Table、List，所以应该是独立的 `dnd/`。`DndTree` 只是组合 `tree + dnd` 的上层能力。

### Collection / Selection / Roving Focus

这些能力在 Menu、Select、Tree、Tabs、Listbox 中都会复用，应该独立成一级目录。不要为了某个组件先写在组件目录里，等第二个组件需要时再复制一份。

## 为什么 core 需要设计文档和代码注释

core 的目标不是“让当前框架 demo 跑起来”，而是保证所有框架组件共享同一套逻辑。排查问题时应按下面顺序定位：

```txt
core snapshot 是否正确
  ↓
adapter 是否订阅到了 snapshot
  ↓
adapter 是否保留了本框架响应式
  ↓
DOM attribute/style/CSS var 是否绑定正确
```

因此 core 里的复杂文件需要保留两类说明：

- 设计手册：解释模块边界、整体流程、第三方库选择、常见 bug 和扩展方式。
- 代码注释：解释关键分支为什么这么写，尤其是第三方 API、异步定位、订阅通知、不可变快照和跨框架响应式边界。
