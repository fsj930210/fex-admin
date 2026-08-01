# Kbd UI

## 用途

`Kbd` 展示单个键盘按键，`KbdGroup` 组合多个按键。

## 导入路径

```tsx
import { Kbd, KbdGroup } from '@fex/components-react/ui/kbd'
```

## 核心示例

```tsx
<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>
```

## Props

| 参数        | 类型        | 默认值      | 必填 | 说明                     |
| ----------- | ----------- | ----------- | ---- | ------------------------ |
| `className` | `string`    | `undefined` | 否   | 合并到对应元素的 class。 |
| `children`  | `ReactNode` | `undefined` | 否   | 按键文本或图标。         |

## 事件与状态

组件继承对应原生元素属性与事件，没有受控状态。按键文案应保持简短。
