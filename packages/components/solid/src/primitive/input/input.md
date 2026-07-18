# Solid Input Primitives

## 用途与导入

```tsx
import { InputClear, InputControl, InputPrefix, InputRoot } from '@fex/components-solid/primitive/input'
export function Demo() { return <InputRoot defaultValue="admin"><InputPrefix>@</InputPrefix><InputControl aria-label="账号" /><InputClear /></InputRoot> }
```

## Props

| 组件 | 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `InputRoot` | `value` | `string` | `undefined` | 否 | 受控值。 |
| `InputRoot` | `defaultValue` | `string` | `''` | 否 | 非受控初值。 |
| `InputRoot` | `onValueChange` | `(value, meta) => void` | `undefined` | 否 | 输入或清空回调。 |
| `InputRoot` | `disabled/readOnly/invalid` | `boolean` | `false` | 否 | 字段状态。 |
| `InputControl` | 原生 input 属性 | `JSX.InputHTMLAttributes` | `undefined` | 否 | 原生属性和事件。 |
| `InputClear` | `forceMount` | `boolean` | `false` | 否 | 无值时仍挂载。 |

受控模式用 `value/onValueChange`，非受控模式用 `defaultValue`。逻辑层使用 `import { createInput } from '@fex/components-solid/primitive/input/create-input'`。Field 不属于 Input 内部；Prefix、Suffix 和两个 Addon 只提供结构。清空会遵守 disabled/readOnly 并恢复焦点。
