# Input Primitive

## 用途

`Input` 是文本输入的基础控件，保留原生 input 能力并提供统一尺寸、边框、禁用和校验态样式。

## 导入路径

```tsx
import { Input } from '@fex/components-react/primitive/input'
```

## 核心示例

```tsx
import { Input } from '@fex/components-react/primitive/input'

export function Demo() {
  return <Input name="email" placeholder="admin@example.com" type="email" />
}
```

## Props

| 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `type` | `HTMLInputTypeAttribute` | `undefined` | 否 | 原生 input 类型。 |
| `value` | `string \| number \| readonly string[]` | `undefined` | 否 | 受控值。 |
| `defaultValue` | `string \| number \| readonly string[]` | `undefined` | 否 | 非受控初始值。 |
| `className` | `string` | `undefined` | 否 | 合并到 input 的 class。 |

## 事件/回调

常用 `onChange`、`onInput`、`onFocus`、`onBlur`，均为原生 React input 事件。

## 受控/非受控

支持原生受控和非受控模式。受控时传入 `value` 和 `onChange`；非受控时传入 `defaultValue`。

## 注意事项

校验态可使用 `aria-invalid` 触发默认错误样式。

## 常见组合

通常与 `label`、表单错误文本和表单布局组件组合。
