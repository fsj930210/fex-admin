# Angular Form and Field primitives

## 用途与导入

Angular 使用 `injectForm` 和 `TanStackField`；`[fexForm]` 可挂到原生 form，也可挂到 `ng-container` 实现无 DOM 逻辑表单。Field parts 使用 directive 保持调用方真实 DOM。

```ts
import { Form, FormField, injectForm } from '@fex/components-angular/primitive/form'
import { FieldControl, FieldLabel, FieldRoot } from '@fex/components-angular/primitive/field'
const form = injectForm({ defaultValues: { name: '' } })
```

```html
<form [fexForm]="form" novalidate>
  <ng-container [tanstackField]="form" name="name" #field="field">
    <fex-field-root><label fexFieldLabel>Name</label><fex-input-root [value]="field.api.state.value" (valueChange)="field.api.handleChange($event)"><input fexInputControl fexFieldControl (blur)="field.api.handleBlur()" /></fex-input-root></fex-field-root>
  </ng-container>
</form>
```

## Props / Inputs

| 组件/指令 | 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `Form` | `fexForm` | `{ handleSubmit(): unknown }` | — | 是 | 原生 submit 时调用 TanStack。 |
| `Form` | `scrollToFirstError` | `boolean \| (ScrollIntoViewOptions & { focus?: boolean })` | `true` | 否 | 提交失败后定位并聚焦当前 form 的第一个无效控件。 |
| `FieldRoot` | `orientation` | `vertical/horizontal/responsive` | `vertical` | 否 | 方向。 |
| `FieldRoot` | 状态 inputs | `boolean` | `false` | 否 | required、disabled、readOnly、invalid、hasDescription、hasError。 |
| `FieldControl` | `fexFieldControl` | directive | — | 是 | 将 Root 的 id/ARIA/state 绑定到实际 control。 |

其它指令为 Label、RequiredIndicator、Description、Error、Group、Set、Legend、Content、Title、Separator；宿主 class 会通过公共 helper 显式合并。

## 状态、无 DOM 与注意事项

- `<ng-container [fexForm]="childForm">` 等价于其它框架的 `component=false`，不产生非法嵌套 form。
- 原生 form 默认在提交校验完成后滚动并聚焦第一个 `aria-invalid=true` 的 `FieldControl`；传 `[scrollToFirstError]="false"` 关闭。`ng-container` 没有 DOM 查询边界，不自动定位。

## Rules 与字段联动

`[fexField]` 是 Angular 对 `form.Field` 扩展的等价 directive，支持 `[rules]`、`[dependencies]`、`[validateTrigger]`、`[validateDebounce]`、`[validateFirst]`。Rule 支持 `required/message/min/max/len/pattern/enum/type/whitespace/transform/validator`；底层仍创建 TanStack FieldApi。
- `[initialValue]` 是 TanStack 字段 `defaultValue` 的语义别名。
- 级联在源字段 change 事件中调用 `setFieldValue()`，不使用 `effect`。
- 实例直接使用 `getFieldValue()`、`setFieldValue()`、`reset()`；长表单使用 `[scrollToFirstError]`；布局使用 `orientation`。
- value、meta、validators、异步校验和提交均由 TanStack 管理。
- required 仅提供语义；Standard Schema 直接交给 TanStack，不内置 Zod。
