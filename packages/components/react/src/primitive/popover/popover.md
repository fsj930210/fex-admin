# Popover

Popover 是基于 `@fex/components-core` 的浮层 primitive。core 负责触发、开关状态、定位、碰撞处理、箭头变量和挂载容器，React 层只负责 render prop、DOM 事件、ref 与 Portal 适配。

## 导入

```tsx
import { Popover } from '@fex/components-react/primitive/popover'
```

## 基础用法

```tsx
import { Popover } from '@fex/components-react/primitive/popover'

export function Demo() {
  return (
    <PopoverRoot placement="bottomLeft" sideOffset={8} arrow>
      <PopoverTrigger>
        {(triggerProps) => <button {...triggerProps}>Open</button>}
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>
            <PopoverTitle>Title</PopoverTitle>
            <PopoverDescription>Content</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  )
}
```

## Props

## 偏移

`sideOffset` 控制主轴距离，`alignOffset` 控制交叉轴偏移。

```tsx
<PopoverRoot placement="bottomLeft" sideOffset={8} alignOffset={28} arrow>
  <PopoverTrigger>
    {(props) => <button {...props}>Offset</button>}
  </PopoverTrigger>
  <PopoverPortal>
    <PopoverContent>
      <PopoverArrow />
      <PopoverHeader>
        <PopoverTitle>Offset</PopoverTitle>
        <PopoverDescription>Content is shifted along the aligned edge.</PopoverDescription>
      </PopoverHeader>
    </PopoverContent>
  </PopoverPortal>
</PopoverRoot>
```

## 自定义 UI

默认组件只是逻辑 hooks 的消费方。用户如果不想使用内置 DOM，可以直接消费 `usePopoverTrigger`、`usePopoverContent` 和 `usePopoverArrow` 自己实现 UI。

```tsx
import {
  Popover,
  usePopoverContent,
  usePopoverTrigger,
} from '@fex/components-react/primitive/popover'

function CustomTrigger() {
  const trigger = usePopoverTrigger({})
  return <button {...trigger.props}>Custom trigger</button>
}

function CustomContent() {
  const content = usePopoverContent({ className: 'my-popover' })
  if (!content.mounted) {
    return null
  }
  return <section {...content.props}>Custom content</section>
}

export function Demo() {
  return (
    <PopoverRoot arrow>
      <CustomTrigger />
      <PopoverPortal>
        <CustomContent />
      </PopoverPortal>
    </PopoverRoot>
  )
}
```

## Hooks

| 名称 | 返回值 | 说明 |
| --- | --- | --- |
| `usePopover` | `{ overlay, snapshot, triggerRef, arrow }` | 读取 Popover 逻辑上下文和 core snapshot。 |
| `usePopoverTrigger` | `{ props, snapshot }` | 返回可绑定到触发元素的 ARIA、事件、ref 和状态。 |
| `usePopoverContent` | `{ mounted, props, snapshot }` | 返回内容节点 props；未挂载时 `mounted` 为 `false`。 |
| `usePopoverArrow` | `{ mounted, props, snapshot }` | 返回箭头节点 props；未启用箭头时 `mounted` 为 `false`。 |

### Root

| 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | - | 否 | 受控打开状态。 |
| `defaultOpen` | `boolean` | `false` | 否 | 非受控默认打开状态。 |
| `onOpenChange` | `(open, info) => void` | - | 否 | 打开状态变化回调。 |
| `trigger` | `OverlayTrigger[]` | `['click']` | 否 | 触发方式数组，支持 `click`、`hover`、`focus`、`context-menu`。 |
| `placement` | `FloatingPlacement` | `bottom` | 否 | antd 风格位置，如 `bottomLeft`。 |
| `side` | `top \| right \| bottom \| left` | - | 否 | Radix 风格主方向。 |
| `align` | `start \| center \| end` | - | 否 | Radix 风格对齐方式。 |
| `sideOffset` | `number` | `6` | 否 | 主轴偏移。 |
| `alignOffset` | `number` | `0` | 否 | 交叉轴偏移。 |
| `arrow` | `boolean` | `false` | 否 | 是否启用箭头。 |
| `getPopupContainer` | `(reference) => HTMLElement` | `document.body` | 否 | Portal 挂载容器。 |
| `hoverOpenDelay` | `number` | `0` | 否 | hover 打开延迟。 |
| `hoverCloseDelay` | `number` | `0` | 否 | hover 关闭延迟。 |
| `dismiss` | `{ escapeKey?: boolean; outsidePointer?: boolean; overlayPointer?: boolean }` | `{ escapeKey: true, outsidePointer: true }` | 否 | 关闭行为配置。 |

### Trigger

| 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `children` | `(props) => ReactNode` | - | 是 | render prop，返回最终触发元素。 |

`Trigger` 不内置按钮，不 clone child，也不要求用户组件转发 ref。所有触发事件、ARIA、`data-state` 和 `ref` 都通过 render prop 一次性传出。

### Content

| 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `className` | `string` | - | 否 | 合并到内容节点。 |
| `style` | `CSSProperties` | - | 否 | 合并到内容节点。 |

## 受控与非受控

不传 `open` 时由 core store 管理状态；传入 `open` 后进入受控模式，core 只通过 `onOpenChange` 请求外部更新。

## 事件 / 回调

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `onOpenChange` | `(open, info) => void` | 打开状态变化请求。`info.reason` 可用于区分 `trigger-click`、`trigger-hover`、`escape-key`、`outside-pointer` 等来源。 |

## 注意事项

- 箭头方向来自 core 计算后的最终 `snapshot.side`，不要用原始 `placement` 推导箭头方向。
- 内容坐标由 CSS 变量 `--floating-x`、`--floating-y`、`--floating-strategy` 提供，避免滚动和 resize 时触发 React 重渲染。
- `Trigger` 使用 render prop 传出 `ref` 和事件，不使用 `asChild` 或 clone child。

## 常见组合方式

- Click Popover：`trigger={['click']}`。
- Hover + Focus Popover：`trigger={['hover', 'focus']}`，可配合 `hoverCloseDelay`。
- Context Menu：`trigger={['context-menu']}`，可配合 `placement="rightTop"`。
- 自定义容器：传入 `getPopupContainer` 并使用 `PopoverPortal`。
