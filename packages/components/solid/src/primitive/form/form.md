# Solid Form and Field primitives

## 用途与导入

`createForm`、`form.Field` 和细粒度订阅来自 TanStack；`Form` 处理原生提交与无 DOM 模式，Field primitives 负责结构和 ARIA。

```tsx
import { FieldControl, FieldLabel, FieldRoot } from '@fex/components-solid/primitive/field'
import { createForm, Form } from '@fex/components-solid/primitive/form'
import { InputControl, InputRoot } from '@fex/components-solid/primitive/input'
const form = createForm(() => ({ defaultValues: { name: '' }, onSubmit: ({ value }) => console.log(value) }))
export function Example() { return <Form form={form}><form.Field name="name">{(field) => <FieldRoot><FieldLabel>Name</FieldLabel><FieldControl>{({ props }) => <InputRoot value={field().state.value} onValueChange={field().handleChange}><InputControl {...props} onBlur={field().handleBlur} /></InputRoot>}</FieldControl></FieldRoot>}</form.Field><button type="submit">Submit</button></Form> }
```

## Props

| 组件 | 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `Form` | `form` | `{ handleSubmit(): unknown }` | — | 是 | TanStack 实例。 |
| `Form` | `component` | `'form' \| false` | `'form'` | 否 | 无 DOM 模式。 |
| `Form` | `scrollToFirstError` | `boolean \| (ScrollIntoViewOptions & { focus?: boolean })` | `true` | 否 | 提交失败后定位并聚焦当前 form 的第一个无效控件。 |
| `FieldRoot` | `orientation` | `vertical/horizontal/responsive` | `vertical` | 否 | 字段方向。 |
| `FieldRoot` | 状态 props | `boolean` | `false` | 否 | required、disabled、readOnly、invalid、hasDescription、hasError。 |
| `FieldControl` | `children` | `(binding) => JSX.Element` | — | 是 | 显式 control 绑定。 |

其余原子为 Label、RequiredIndicator、Description、Error、Group、Set、Legend、Content、Title、Separator，均透传原生属性。

## 状态与注意事项

- value、meta、validators、async、submit 均由 TanStack 管理；primitive 不复制状态。
- required 只表达语义，不生成规则；Standard Schema 直接传 validators。
- `component=false` 时按钮使用 `type="button"` 并调用 `form.handleSubmit()`。
- 默认在提交校验完成后滚动并聚焦第一个 `aria-invalid=true` 的 `FieldControl`；传 `false` 关闭。无 DOM 模式不自动定位。

## Rules 与字段联动

`form.Field` 直接支持 `rules`、`dependencies`、`validateTrigger`、`validateDebounce`、`validateFirst`。Rule 支持 `required/message/min/max/len/pattern/enum/type/whitespace/transform/validator`；底层转换为 TanStack validators，不使用 `createEffect`。

- `initialValue` 是 TanStack 字段 `defaultValue` 的语义别名。
- 级联在源字段事件中调用 `setFieldValue()`，通过 `form.Subscribe` 派生目标选项，不使用 effect。
- 实例直接使用 `getFieldValue()`、`setFieldValue()`、`reset()`；长表单使用 `scrollToFirstError`；布局使用 `FieldRoot orientation`。
