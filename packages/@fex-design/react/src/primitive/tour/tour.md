# Tour

Tour 是组合式漫游引导 primitive。它通过 `Tour.Step` 注册流程，通过 `Tour.Target` 注册目标元素；不接收 steps 数组，也不规定标题、描述、进度和卡片布局。

## 导入

```tsx
import { Tour, useTour } from '@fex-design/react/primitive/tour'
```

## 基础用法

```tsx
<Tour.Root>
  <Tour.Target name="sidebar">
    {({ ref, ...props }) => <aside ref={ref} {...props}>Sidebar</aside>}
  </Tour.Target>

  <Tour.Portal>
    <Tour.Overlay />
    <Tour.Step name="sidebar-step" target="sidebar" placement="right">
      <Tour.Content>
        <Tour.Arrow />
        <h2>导航菜单</h2>
        <p>从这里切换系统模块。</p>
        <Tour.Control action="next">下一步</Tour.Control>
      </Tour.Content>
    </Tour.Step>
  </Tour.Portal>
</Tour.Root>
```

## 受控和非受控

`defaultOpen`、`defaultCurrent` 启用非受控模式。传入 `open`、`current` 后，调用方必须在 `onOpenChange`、`onChange` 中回流新值。

```tsx
<Tour.Root
  open={open}
  current={current}
  onOpenChange={setOpen}
  onChange={setCurrent}
>
  ...
</Tour.Root>
```

## Primitive 组件

| 组件 | 说明 |
| --- | --- |
| `Tour.Root` | 创建 Tour controller 和上下文 |
| `Tour.Step` | 注册一个步骤，按组合顺序参与导航 |
| `Tour.Target` | 注册目标元素并传出 render props |
| `Tour.Portal` | 将引导层挂载到指定容器 |
| `Tour.Overlay` | 渲染遮罩和 spotlight，可通过 render props 替换 |
| `Tour.Content` | 连接 Floating UI 并渲染自定义内容 |
| `Tour.Arrow` | 可选的浮层箭头 |
| `Tour.Control` | 通过 `action` 统一绑定导航按钮 |
| `useTour` | 读取 snapshot 和 controller actions |

## Root Props

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | - | 否 | 受控打开状态 |
| `defaultOpen` | `boolean` | `false` | 否 | 非受控初始打开状态 |
| `current` | `number` | - | 否 | 受控当前步骤索引 |
| `defaultCurrent` | `number` | `0` | 否 | 非受控初始步骤索引 |
| `keyboard` | `boolean` | `true` | 否 | 是否启用 Escape、左右方向键 |
| `overlay` | `boolean` | `true` | 否 | 是否启用默认遮罩 |
| `closeOnOverlayClick` | `boolean` | `true` | 否 | 是否允许点击遮罩关闭 |
| `zIndex` | `number` | `1001` | 否 | 引导层内容的层级，遮罩使用 `zIndex - 1` |
| `targetMissing` | `'wait' \| 'skip' \| 'close'` | `'wait'` | 否 | 目标未挂载时的策略 |
| `targetTimeout` | `number` | `3000` | 否 | 等待目标的超时时间 |
| `onOpenChange` | `(open, info) => void` | - | 否 | 打开状态变化 |
| `onChange` | `(index, info) => void` | - | 否 | 步骤变化 |
| `onClose` | `(info) => void` | - | 否 | 关闭或跳过 |
| `onFinish` | `() => void` | - | 否 | 完成最后一步 |

## Step Props

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `name` | `string` | - | 是 | 步骤唯一名称 |
| `target` | `string \| null` | - | 否 | `Target` 名称，`null` 时居中显示 |
| `placement` | `FloatingPlacement` | `'bottom'` | 否 | 支持 `top/topLeft/topRight/right/rightTop/rightBottom/bottom/bottomLeft/bottomRight/left/leftTop/leftBottom` |
| `arrow` | `boolean \| object` | `true` | 否 | 是否显示箭头以及是否指向中心 |
| `mask` | `boolean \| object` | `true` | 否 | 是否显示遮罩 |
| `gap` | `{ offset? }` | `6` | 否 | spotlight 矩形边距 |
| `scrollIntoViewOptions` | `boolean \| ScrollIntoViewOptions` | `true` | 否 | 进入步骤时是否滚动目标 |
| `disabledInteraction` | `boolean` | `false` | 否 | 是否禁止高亮区域交互 |
| `data` | `unknown` | - | 否 | 业务内容数据，不由 primitive 解释 |

## Control Actions

```tsx
<Tour.Control action="previous">上一步</Tour.Control>
<Tour.Control action="next">下一步</Tour.Control>
<Tour.Control action="skip">跳过</Tour.Control>
<Tour.Control action="close">关闭</Tour.Control>
<Tour.Control action="complete">完成</Tour.Control>
```

`next` 在最后一步等价于 `complete`。如果需要完全自定义按钮，可以使用 `useTour()` 的 `next`、`previous`、`skip`、`close` 和 `complete`。

位置名称的主方向表示浮层所在侧，后缀表示边缘对齐：例如 `top` 是水平居中，`topLeft` 是左边对齐，`topRight` 是右边对齐；`rightTop/rightBottom`、`bottomLeft/bottomRight`、`leftTop/leftBottom` 依此类推。

遮罩对象可以传入 `color`，例如 `mask={{ color: 'rgba(0, 0, 0, 0.72)' }}`；使用 render function 时，`Tour.Overlay` 会把计算后的 `color` 一并传出。

## 注意事项

- `Tour.Portal` 即使关闭时也会挂载步骤注册节点；`Overlay` 和 `Content` 会自行根据状态不渲染。
- `Tour.Step` 的组合顺序就是导航顺序，动态步骤应保持稳定顺序。
- Primitive 不提供标题、描述、进度和默认卡片；这些内容由调用方渲染。
- UI 层可以在此 primitive 之上把 steps 数组转换为多个 `Tour.Step`。
