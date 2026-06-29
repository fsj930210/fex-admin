# Textarea Primitive

## 用途

`Textarea` 是多行文本输入的基础控件，提供统一边框、禁用和校验态样式。

## 导入路径

```tsx
import { Textarea } from '@fex/components-react/primitive/textarea'
```

## 核心示例

```tsx
import { Textarea } from '@fex/components-react/primitive/textarea'

export function Demo() {
  return <Textarea name="remark" placeholder="请输入备注" />
}
```

## Props

| 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string \| readonly string[] \| number` | `undefined` | 否 | 受控值。 |
| `defaultValue` | `string \| readonly string[] \| number` | `undefined` | 否 | 非受控初始值。 |
| `className` | `string` | `undefined` | 否 | 合并到 textarea 的 class。 |

## 事件/回调

常用 `onChange`、`onInput`、`onFocus`、`onBlur`，均为原生 React textarea 事件。

## 受控/非受控

支持原生受控和非受控模式。受控时传入 `value` 和 `onChange`；非受控时传入 `defaultValue`。

## 注意事项

校验态可使用 `aria-invalid` 触发默认错误样式。

## 常见组合

常与表单项、字数提示、错误提示和提交按钮组合。
