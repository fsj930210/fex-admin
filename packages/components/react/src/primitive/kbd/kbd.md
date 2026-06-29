# Kbd Primitive

## 用途

`Kbd` 用于展示键盘按键，`KbdGroup` 用于组合多个按键。

## 导入路径

```tsx
import { Kbd, KbdGroup } from '@fex/components-react/primitive/kbd'
```

## 核心示例

```tsx
import { Kbd, KbdGroup } from '@fex/components-react/primitive/kbd'

export function Demo() {
  return (
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  )
}
```

## Props

| 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `className` | `string` | `undefined` | 否 | 合并到对应元素的 class。 |
| `children` | `ReactNode` | `undefined` | 否 | 按键文本或图标。 |

## 事件/回调

继承对应原生元素事件，但组件默认用于展示，不建议绑定业务交互。

## 受控/非受控

无内部状态。

## 注意事项

按键文案应尽量短，例如 `Ctrl`、`K`、`Enter`。

## 常见组合

常用于搜索框提示、命令面板入口和 Tooltip 内容。
