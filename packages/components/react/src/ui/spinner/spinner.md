# Spinner UI

## 用途

`Spinner` 用于局部加载反馈，提供动画图形和尺寸样式。

## 导入路径

```tsx
import { Spinner } from '@fex/components-react/ui/spinner'
```

## 核心示例

```tsx
<Spinner size="md" aria-label="加载中" />
```

## Props

| 参数        | 类型                   | 默认值      | 必填 | 说明                   |
| ----------- | ---------------------- | ----------- | ---- | ---------------------- |
| `size`      | `'sm' \| 'md' \| 'lg'` | `'md'`      | 否   | 图标尺寸。             |
| `className` | `string`               | `undefined` | 否   | 合并到根元素的 class。 |

## 事件与状态

组件继承 `span` 原生属性与事件，没有受控状态。需要无障碍提示时应提供 `aria-label` 或可见文本。
