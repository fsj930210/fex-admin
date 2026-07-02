# Popover

Popover 是基于 `@fex/components-core` 的浮层 primitive。core 负责触发、开关状态、定位、碰撞处理、箭头变量和挂载容器，Solid 层只负责 render prop、DOM 事件、ref、Portal 与 signal 适配。

## 导入

```tsx
import {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from '@fex/components-solid/primitive/popover'
```

## 核心使用示例

```tsx
<Popover placement="bottomLeft" sideOffset={8} alignOffset={28} arrow>
  <PopoverTrigger>
    {(slot) => <button {...slot.props} ref={slot.ref}>Open</button>}
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
</Popover>
```

## Props

| 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | - | 否 | 受控打开状态。 |
| `defaultOpen` | `boolean` | `false` | 否 | 非受控默认打开状态。 |
| `onOpenChange` | `(open, info) => void` | - | 否 | 打开状态变化回调。 |
| `trigger` | `OverlayTrigger[]` | `['click']` | 否 | 触发方式数组。 |
| `placement` | `FloatingPlacement` | `bottom` | 否 | antd 风格位置，如 `bottomLeft`。 |
| `side` | `top \| right \| bottom \| left` | - | 否 | Radix 风格主方向。 |
| `align` | `start \| center \| end` | - | 否 | Radix 风格对齐方式。 |
| `sideOffset` | `number` | `6` | 否 | 主轴偏移。 |
| `alignOffset` | `number` | `0` | 否 | 交叉轴偏移。 |
| `arrow` | `boolean` | `false` | 否 | 是否启用箭头。 |
| `hoverOpenDelay` | `number` | `0` | 否 | hover 打开延迟。 |
| `hoverCloseDelay` | `number` | `0` | 否 | hover 关闭延迟。 |
| `getPopupContainer` | `(reference) => HTMLElement` | `document.body` | 否 | Portal 挂载容器。 |

## 事件 / 回调

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `onOpenChange` | `(open, info) => void` | 打开状态变化请求。 |

## 受控 / 非受控

不传 `open` 时组件使用 signal 保存内部状态；传入 `open` 后只通过 `onOpenChange` 请求外部更新。

## 注意事项

- Solid adapter 必须在 JSX 或派生函数中调用 `snapshot()`，不要把 `snapshot().open` 缓存成普通值。
- 箭头样式必须从最终 `snapshot().side` 派生。
- 坐标通过 CSS 变量写到 DOM，不进入 Solid signal。

## 常见组合方式

- Click Popover：`trigger={['click']}`。
- Hover + Focus：`trigger={['hover', 'focus']}`。
- Context Menu：`trigger={['context-menu']}`。
- 自定义容器：传入 `getPopupContainer` 并使用 `PopoverPortal`。
