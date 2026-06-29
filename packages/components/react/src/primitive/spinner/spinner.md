# Spinner Primitive

## 用途

`Spinner` 用于局部加载反馈。Primitive 层只提供动画图形和尺寸样式。

## 导入路径

```tsx
import { Spinner } from '@fex/components-react/primitive/spinner'
```

## 核心示例

```tsx
import { Spinner } from '@fex/components-react/primitive/spinner'

export function Demo() {
  return <Spinner size="md" aria-label="Loading" />
}
```

## Props

| 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 否 | 图标尺寸。 |
| `className` | `string` | `undefined` | 否 | 合并到根元素的 class。 |

## 事件/回调

继承 `span` 原生事件。通常不需要绑定事件。

## 受控/非受控

无内部状态。

## 注意事项

需要可访问提示时传入 `aria-label` 或在外层提供文本。

## 常见组合

常与按钮 loading、卡片局部加载和表格空白区加载组合。
