# Angular Input Primitives

## 用途与导入

```ts
import { InputClear, InputControl, InputRoot } from '@fex/components-angular/primitive/input'
@Component({ imports: [InputRoot, InputControl, InputClear], template: '<fex-input-root defaultValue="admin"><input fexInputControl aria-label="账号"><button fexInputClear>×</button></fex-input-root>' })
export class Demo {}
```

## Inputs / Outputs

| 组件 | 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `InputRoot` | `value/defaultValue` | `string` | `undefined/''` | 否 | 受控值与非受控初值。 |
| `InputRoot` | `disabled/readOnly/invalid` | `boolean` | `false` | 否 | 字段状态。 |
| `InputRoot` | `valueChange` | `EventEmitter<string>` | — | 否 | 输入和清空后的值。 |
| `InputRoot` | `clear` | `EventEmitter<void>` | — | 否 | 清空成功。 |
| `InputControl` | 原生 input 属性 | 原生属性 | — | 否 | 使用 `input[fexInputControl]`。 |
| `InputClear` | 原生 button 属性 | 原生属性 | — | 否 | 使用 `button[fexInputClear]`。 |

Prefix、Suffix、AddonBefore、AddonAfter 是宿主 class 自动合并的独立指令。Field 仍独立负责标签、说明、错误和 ARIA 关联。清空遵守 disabled/readOnly 并恢复焦点。
