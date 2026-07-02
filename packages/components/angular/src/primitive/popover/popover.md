# Popover

Popover 是基于 `@fex/components-core` 的浮层 primitive。core 负责触发、开关状态、定位、碰撞处理、箭头变量和挂载容器，Angular 层只负责 attribute directive、HostListener、signal 与 DOM 挂载适配。

## 导入

```ts
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from '@fex/components-angular/primitive/popover'
```

## 核心使用示例

```html
<fex-popover placement="bottomLeft" [sideOffset]="8" [alignOffset]="28" [arrow]="true">
  <button fexPopoverTrigger>Open</button>
  <fex-popover-content>
    <fex-popover-arrow />
    <fex-popover-header>
      <fex-popover-title>Title</fex-popover-title>
      <fex-popover-description>Content</fex-popover-description>
    </fex-popover-header>
  </fex-popover-content>
</fex-popover>
```

## Props / Inputs

| 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | - | 否 | 受控打开状态。 |
| `defaultOpen` | `boolean` | `false` | 否 | 非受控默认打开状态。 |
| `trigger` | `OverlayTrigger[]` | `['click']` | 否 | 触发方式数组。 |
| `placement` | `FloatingPlacement` | `bottom` | 否 | antd 风格位置，如 `bottomLeft`。 |
| `side` | `top \| right \| bottom \| left` | - | 否 | Radix 风格主方向。 |
| `align` | `start \| center \| end` | - | 否 | Radix 风格对齐方式。 |
| `sideOffset` | `number` | `6` | 否 | 主轴偏移。 |
| `alignOffset` | `number` | `0` | 否 | 交叉轴偏移。 |
| `arrow` | `boolean` | `false` | 否 | 是否启用箭头。 |
| `hoverOpenDelay` | `number` | `0` | 否 | hover 打开延迟。 |
| `hoverCloseDelay` | `number` | `0` | 否 | hover 关闭延迟。 |
| `getPopupContainer` | `(reference) => HTMLElement` | `document.body` | 否 | 浮层挂载容器。 |

## 事件 / Outputs

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `openChange` | `EventEmitter<boolean>` | 打开状态变化请求。 |

## 受控 / 非受控

不传 `open` 时组件使用 `defaultOpen` 初始化内部状态；传入 `open` 后进入受控模式，组件通过 `openChange` 请求外部更新。

## 注意事项

- `fexPopoverTrigger` 必须绑定在真实 button 元素上，core 需要该 DOM 作为定位 reference。
- `fex-popover-content` 会被移动到 `getPopupContainer` 返回的容器中，因此外部点击判断使用真实 DOM 边界。
- 箭头元素会注册给 Floating UI arrow middleware，不只是装饰节点。

## 常见组合方式

- Click Popover：`[trigger]="['click']"`。
- Hover + Focus：`[trigger]="['hover', 'focus']"`。
- Context Menu：`[trigger]="['context-menu']"`。
- 自定义容器：传入 `[getPopupContainer]`。
