# Popover

Popover 是基于 `@fex/components-core` 的浮层 primitive。core 负责触发、开关状态、定位、碰撞处理、箭头变量和挂载容器，Vue 层只负责 slot props、DOM 事件、ref 与响应式适配。

## 导入

```ts
import {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from '@fex/components-vue/primitive/popover'
```

## 核心使用示例

```vue
<template>
  <Popover placement="bottomLeft" :side-offset="8" :align-offset="28" arrow>
    <PopoverTrigger v-slot="{ props, ref }">
      <button v-bind="props" :ref="ref">Open</button>
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
</template>
```

## Props

| 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | - | 否 | 受控打开状态。 |
| `defaultOpen` | `boolean` | `false` | 否 | 非受控默认打开状态。 |
| `trigger` | `OverlayTrigger[]` | `['click']` | 否 | 触发方式数组，支持 `click`、`hover`、`focus`、`context-menu`。 |
| `placement` | `FloatingPlacement` | `bottom` | 否 | antd 风格位置，如 `bottomLeft`。 |
| `side` | `top \| right \| bottom \| left` | - | 否 | Radix 风格主方向。 |
| `align` | `start \| center \| end` | - | 否 | Radix 风格对齐方式。 |
| `sideOffset` | `number` | `6` | 否 | 主轴偏移。 |
| `alignOffset` | `number` | `0` | 否 | 交叉轴偏移。 |
| `arrow` | `boolean` | `false` | 否 | 是否启用箭头。 |
| `hoverOpenDelay` | `number` | `0` | 否 | hover 打开延迟。 |
| `hoverCloseDelay` | `number` | `0` | 否 | hover 关闭延迟。 |
| `getPopupContainer` | `(reference) => HTMLElement` | `document.body` | 否 | Portal 挂载容器。 |
| `dismiss` | `{ escapeKey?: boolean; outsidePointer?: boolean; overlayPointer?: boolean }` | `{ escapeKey: true, outsidePointer: true }` | 否 | 关闭行为配置。 |

## 事件 / 回调

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `openChange` | `(open, info) => void` | 打开状态变化请求。`info.reason` 可用于排查触发来源。 |

## 受控 / 非受控

不传 `open` 时组件使用 `defaultOpen` 初始化内部状态；传入 `open` 后进入受控模式，组件只通过 `openChange` 请求外部更新。

## 注意事项

- Vue adapter 必须通过 `snapshot.value.xxx` 建立依赖，不要提前解构 snapshot。
- 箭头方向使用 core 计算后的最终 `side`，发生 flip 后不要再用原始 `placement` 推导。
- 定位坐标通过 CSS 变量写到 DOM，Vue 模板不直接订阅 x/y。

## 常见组合方式

- 点击打开：`trigger="['click']"`。
- hover + focus：`:trigger="['hover', 'focus']"`。
- 右键触发：`:trigger="['context-menu']"`。
- 自定义容器：传入 `getPopupContainer` 并使用 `PopoverPortal`。
