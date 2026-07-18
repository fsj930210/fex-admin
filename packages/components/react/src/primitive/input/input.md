# React Input Primitives

## 用途

Input primitives 将原生 input、输入值协议、清空操作和附属内容拆为可组合的原子组件。`InputRoot` 管理受控或非受控值；`InputControl` 是唯一的原生 `<input>`；DatePicker、Select 等输入型组件也可直接复用 `useInput` 的值与清空协议。

## 导入路径

```tsx
import {
  InputAddonAfter,
  InputAddonBefore,
  InputClear,
  InputControl,
  InputPrefix,
  InputRoot,
  InputSuffix,
} from '@fex/components-react/primitive/input'
import { useInput } from '@fex/components-react/primitive/input/use-input'
```

## 核心示例

```tsx
import {
  InputAddonBefore,
  InputClear,
  InputControl,
  InputPrefix,
  InputRoot,
} from '@fex/components-react/primitive/input'
import { SearchIcon } from './search-icon'

export function Example() {
  return (
    <InputRoot defaultValue="fex-admin">
      <InputAddonBefore>https://</InputAddonBefore>
      <InputPrefix><SearchIcon aria-hidden /></InputPrefix>
      <InputControl name="site" placeholder="输入站点" />
      <InputClear aria-label="清空站点" />
    </InputRoot>
  )
}
```

子组件顺序就是最终布局顺序：`InputAddonBefore`、`InputPrefix`、`InputControl`、`InputSuffix`、`InputClear`、`InputAddonAfter`。

## Props

### `InputRoot`

| 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string` | `undefined` | 否 | 受控输入值。 |
| `defaultValue` | `string` | `''` | 否 | 非受控初始值。 |
| `onValueChange` | `(value, meta) => void` | `undefined` | 否 | 输入或清空后触发。`meta.reason` 为 `input` 或 `clear`。 |
| `onClear` | `(meta) => void` | `undefined` | 否 | 清空成功后触发。 |
| `disabled` | `boolean` | `false` | 否 | 禁用控制节点及清空操作。 |
| `readOnly` | `boolean` | `false` | 否 | 保留可聚焦能力，但禁止值修改和清空。 |
| `invalid` | `boolean` | `false` | 否 | 为 Root 和 Control 提供错误状态。 |
| `aria-invalid` | `boolean \| 'true' \| 'false'` | `undefined` | 否 | 与 `invalid` 等价，可由独立 `Field` 透传。 |
| `className` | `string` | `undefined` | 否 | 合并到输入组合根节点。 |

### `InputControl`

| 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| 原生 `input` 属性 | `ComponentProps<'input'>` | `undefined` | 否 | 例如 `name`、`type`、`placeholder`、`required`、`autoComplete`。 |
| `className` | `string` | `undefined` | 否 | 合并到原生 input。 |
| `onChange` | `(event) => void` | `undefined` | 否 | 保留原生事件；未阻止默认行为时会更新 Root 值。 |

`InputControl` 必须位于 `InputRoot` 内，且一个 Root 只放置一个 Control。

### 附属原子组件

| 组件 | 原生节点 | 关键参数 | 说明 |
| --- | --- | --- | --- |
| `InputPrefix` | `span` | 原生 `span` 属性 | 输入框内左侧内容。 |
| `InputSuffix` | `span` | 原生 `span` 属性 | 输入框内右侧内容。 |
| `InputAddonBefore` | `span` | 原生 `span` 属性 | 输入框外左侧附加内容。 |
| `InputAddonAfter` | `span` | 原生 `span` 属性 | 输入框外右侧附加内容。 |
| `InputClear` | `button` | `forceMount`、原生 button 属性 | 清空操作；无值、只读或禁用时默认不渲染。 |

## 事件/回调

- `InputControl` 的 `onChange`、`onInput`、`onFocus`、`onBlur` 等原生事件会正常透传。
- `onValueChange` 是组件值协议，供受控父级、DatePicker 和 Select 等复用。
- `InputClear` 在 `pointerdown` 保持 Control 焦点，点击后调用 `clear()`，然后重新聚焦 Control。
- 在 `InputControl.onChange` 中调用 `event.preventDefault()` 可阻止 Root 写入新值。

## 受控/非受控

受控模式将值放在 Root：

```tsx
const [value, setValue] = useState('admin')

<InputRoot value={value} onValueChange={setValue}>
  <InputControl aria-label="账号" />
  <InputClear />
</InputRoot>
```

非受控模式只传 `defaultValue`：

```tsx
<InputRoot defaultValue="admin">
  <InputControl aria-label="账号" />
  <InputClear />
</InputRoot>
```

## `useInput`

`useInput` 是没有 DOM 结构假设的公开逻辑层，返回 `value`、`canClear`、`setValue`、`clear`、`focus` 和 `focusRef`。DatePicker、Select 等组件可将 `focusRef` 绑定到自己的 input 或 trigger，并复用受控/非受控和清空规则，而无需渲染 Input primitives。

## 注意事项

- `Field` 是独立表单组件；它负责 label、说明、错误文案和 ARIA 关联，不属于 Input 内部。
- prefix、suffix、addon 的业务含义和交互由调用方提供；纯装饰图标应传入 `aria-hidden`。
- `InputClear` 是值清空原子，不负责决定业务字段应清成 `''` 之外的值；复杂值转换应由上层组件处理。
