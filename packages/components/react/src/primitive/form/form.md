# React Form and Field primitives

## 用途

`Form` 将原生提交事件交给 TanStack Form，并支持 `component={false}` 的无 DOM 组合。TanStack `form.Field` 是唯一字段状态入口；Field primitives 只负责 label、说明、错误、分组、方向与 ARIA，不保存 value、dirty、touched 或 errors。

## 导入路径

```tsx
import { Form, useForm } from '@fex/components-react/primitive/form'
import { FieldControl, FieldDescription, FieldError, FieldLabel, FieldRoot } from '@fex/components-react/primitive/field'
```

## 核心示例

```tsx
import { FieldControl, FieldError, FieldLabel, FieldRoot } from '@fex/components-react/primitive/field'
import { Form, useForm } from '@fex/components-react/primitive/form'
import { InputControl, InputRoot } from '@fex/components-react/primitive/input'

export function Example() {
  const form = useForm({ defaultValues: { name: '' }, onSubmit: ({ value }) => console.log(value) })
  return <Form form={form}><form.Field name="name" validators={{ onBlur: ({ value }) => value ? undefined : 'Required' }}>{(field) => {
    const invalid = field.state.meta.isTouched && !field.state.meta.isValid
    return <FieldRoot required invalid={invalid} hasError={invalid}><FieldLabel>Name</FieldLabel><FieldControl>{({ props }) => <InputRoot value={field.state.value} onValueChange={field.handleChange}><InputControl {...props} onBlur={field.handleBlur} /></InputRoot>}</FieldControl>{invalid && <FieldError errors={field.state.meta.errors.map(String)} />}</FieldRoot>
  }}</form.Field><button type="submit">Submit</button></Form>
}
```

## Props

| 组件 | 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `Form` | `form` | `{ handleSubmit(): unknown }` | — | 是 | TanStack Form 实例。 |
| `Form` | `component` | `'form' \| false` | `'form'` | 否 | `false` 时不渲染宿主 DOM。 |
| `Form` | `scrollToFirstError` | `boolean \| (ScrollIntoViewOptions & { focus?: boolean })` | `true` | 否 | 提交失败后在当前 form 内定位第一个无效 `FieldControl`。 |
| `Form` | 原生 form props | `ComponentProps<'form'>` | — | 否 | `component=false` 时不可用。 |
| `FieldRoot` | `orientation` | `'vertical' \| 'horizontal' \| 'responsive'` | `'vertical'` | 否 | 字段结构方向。 |
| `FieldRoot` | `required/disabled/readOnly/invalid` | `boolean` | `false` | 否 | 语义和 data 状态，不执行校验。 |
| `FieldRoot` | `hasDescription/hasError` | `boolean` | `false` | 否 | 精确生成 ARIA 引用。 |
| `FieldControl` | `children` | `(binding) => ReactNode` | — | 是 | 输出 control props 和字段语义状态。 |
| `FieldError` | `errors` | `readonly ReactNode[]` | — | 否 | 错误内容；也支持 children。 |

其它原子：`FieldLabel`、`FieldRequiredIndicator`、`FieldDescription`、`FieldGroup`、`FieldSet`、`FieldLegend`、`FieldContent`、`FieldTitle`、`FieldSeparator` 均透传对应原生节点属性和 ref。

## 事件、状态与校验

- `Form` 先调用用户 `onSubmit`；事件未取消时才 `preventDefault()` 并调用 `form.handleSubmit()`。
- `handleSubmit()` 完成并提交错误 DOM 后，`scrollToFirstError` 聚焦并滚动到当前 form 内第一个 `aria-invalid=true` 的 `FieldControl`；传 `false` 可关闭，也可覆盖原生 scroll 选项。
- `component=false` 没有原生 submit，使用 `type="button"` 并显式调用 `form.handleSubmit()`。
- 字段值、受控状态、校验、异步校验和提交状态完全由 TanStack Form 管理。
- `required` 只表达视觉与 ARIA 语义，不自动注入校验器。Zod、Valibot 等 Standard Schema 直接传给 TanStack `validators`，组件包不内置 schema 库。

## Rules 与字段联动

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `rules` | `Rule[]` | — | AntD 风格规则；支持规则工厂读取其它字段。 |
| `dependencies` | `NamePath[]` | — | 依赖字段更新时自动重新校验当前字段。 |
| `validateTrigger` | `'change' \| 'blur' \| 'submit' \| Trigger[]` | `'change'` | 校验时机。 |
| `validateDebounce` | `number` | `0` | 异步校验防抖毫秒数。 |
| `validateFirst` | `boolean` | `false` | 首条错误后停止。 |
| `initialValue` | 字段值类型 | — | 字段级初始值；是 TanStack `defaultValue` 的语义别名。 |

Rule 支持 `required`、`message`、`min`、`max`、`len`、`pattern`、`enum`、`type`、`whitespace`、`transform`、`validateTrigger` 和异步 `validator`。原始 TanStack `validators/listeners` 仍保留为逃生口，但不是推荐业务 API。

## 常见场景

- 级联字段：在源字段 `handleChange` 事件中调用 `form.setFieldValue()` 更新目标字段；目标选项通过 `form.Subscribe` 派生，不使用 effect。
- 动态规则：使用规则工厂读取 `getFieldValue()`，并通过 `dependencies` 在依赖更新时重新校验。
- 实例读写：使用 TanStack 原生 `getFieldValue()`、`setFieldValue()` 和 `reset()`。
- 长表单：通过 `scrollToFirstError` 自定义滚动、定位和聚焦。
- 布局：通过 `FieldRoot orientation="vertical|horizontal|responsive"` 配置。

## 注意事项与组合

- `FieldControl` 必须显式把 binding props 传给实际 input、trigger 或自定义 control；不使用 clone、`asChild` 或隐式增强。
- `component=false` 没有可限定查询范围的宿主 DOM，因此不会自动定位错误；嵌套场景由外层 form 定位，或在显式提交逻辑中自行处理。
- 只有实际渲染 description/error 时才设置 `hasDescription/hasError`。
- `FieldSet + FieldLegend + FieldGroup` 用于 radio、checkbox 或相关字段集合；`FieldContent/Title/Separator` 用于复杂说明结构。
