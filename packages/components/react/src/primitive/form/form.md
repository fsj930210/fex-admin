# React Form and Field primitives

## 用途

`Form` 提供原生提交边界和当前 TanStack Form 实例的 Context。`Field` 是唯一公开的字段状态入口：它使用最近的 `Form` 实例，并完整透传 TanStack Field 的原生参数。

`FieldRoot`、`FieldLabel`、`FieldControl`、`FieldDescription` 和 `FieldError` 只处理 DOM 语义、ARIA 和字段结构，不保存表单值或校验状态。

## 导入

```tsx
import { Field, FieldControl, FieldError, FieldLabel, FieldRoot } from '@fex/components-react/primitive/field'
import { Form, scrollToField, useForm } from '@fex/components-react/primitive/form'
```

## 核心示例

```tsx
export function Example() {
  const form = useForm({
    defaultValues: { email: '' },
    onSubmit: ({ value }) => console.log(value),
  })

  return <Form form={form}>
    <Field
      name="email"
      validators={{
        onBlur: ({ value }) => /^\S+@\S+\.\S+$/.test(value) ? undefined : '请输入有效邮箱',
      }}
    >
      {(field) => {
        const invalid = field.state.meta.isTouched && !field.state.meta.isValid

        return <FieldRoot required invalid={invalid} hasError={invalid}>
          <FieldLabel>邮箱</FieldLabel>
          <FieldControl>{({ props }) => <input {...props} value={field.state.value} onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value)} />}</FieldControl>
          {invalid && <FieldError errors={field.state.meta.errors.map(String)} />}
        </FieldRoot>
      }}
    </Field>
    <button type="submit">提交</button>
  </Form>
}
```

## API

| 组件 | 参数 | 说明 |
| --- | --- | --- |
| `Form` | `form` | 必填。TanStack Form 实例。 |
| `Form` | `component` | `'form' \| false`；`false` 时仅提供 Context，不渲染宿主 form。 |
| `Form` | `scrollToFirstError` | `boolean \| ScrollIntoViewOptions & { focus?: boolean }`；提交失败后定位首个无效控件。 |
| `Field` | TanStack Field props | 原样支持 `name`、`defaultValue`、`validators`、`listeners` 等全部 TanStack 参数。 |
| `FieldRoot` | `orientation` | `'vertical' \| 'horizontal' \| 'responsive' \| 'inline'`。字段内部结构流向。 |
| `FieldGroup` | `orientation` | `'vertical' \| 'inline'`。字段集合排布。 |

## TanStack 校验与依赖

不提供 `rules`、`dependencies`、`validateTrigger`、`initialValue` 等二次 API。直接使用 TanStack Field 的原生参数：

```tsx
<Field
  name="confirmPassword"
  validators={{
    onChange: ({ value }) => value === form.getFieldValue('password') ? undefined : '两次密码不一致',
    onChangeListenTo: ['password'],
    onChangeAsync: async ({ value }) => await checkAvailability(value),
    onChangeAsyncDebounceMs: 400,
  }}
>
  {(field) => /* render field */ null}
</Field>
```

- 校验时机：`validators.onMount`、`onChange`、`onBlur`、`onSubmit`、`onDynamic`。
- 异步校验和防抖：`onChangeAsync` / `onBlurAsync` 以及对应的 `...AsyncDebounceMs`。
- 校验依赖：`validators.onChangeListenTo` / `onBlurListenTo`。
- 初始值：优先 `useForm({ defaultValues })`，字段级覆盖使用 `defaultValue`。
- 动态数组：数组字段的 render prop 中直接调用 `pushValue`、`insertValue`、`removeValue`；子字段使用完整路径，例如 `contacts[${index}].email`。

## 滚动定位

```tsx
scrollToField(formElement, 'profile.email', {
  behavior: 'smooth',
  block: 'center',
  focus: true,
})
```

`scrollToField` 是独立方法，可定位任意字段；省略字段名才定位第一个 `aria-invalid=true` 的控件。`Form` 的 `scrollToFirstError` 只是提交失败场景的便捷行为。

## 布局边界

布局属于 Field 的结构协议，不属于 `Form`。primitive 不提供 `labelCol`、`wrapperCol`、全局 layout、标签宽度或统一标签对齐策略；这些组合与业务默认值留给后续 ui 层。

`FieldControl` 必须将 render prop 提供的 props 显式传给实际控件。`FieldDescription`、`FieldError`、`FieldLabel` 必须在 `FieldRoot` 内使用。
