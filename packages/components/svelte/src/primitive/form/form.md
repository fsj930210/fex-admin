# Svelte Form and Field primitives

## 用途与导入

`createForm` 与 `form.Field` 来自 TanStack；Form host 支持 `component={false}`，Field parts 使用 snippet 明确传递 control props。

```svelte
<script lang="ts">
import Form from '@fex/components-svelte/primitive/form'
import FieldRoot from '@fex/components-svelte/primitive/field'
import FieldControl from '@fex/components-svelte/primitive/field-control'
import FieldLabel from '@fex/components-svelte/primitive/field-label'
import InputRoot from '@fex/components-svelte/primitive/input'
import InputControl from '@fex/components-svelte/primitive/input-control'
import { createForm } from '@fex/components-svelte/primitive/form/create-form'
const form = createForm(() => ({ defaultValues: { name: '' } }))
</script>
<Form {form}><form.Field name="name">{#snippet children(field)}<FieldRoot><FieldLabel>Name</FieldLabel><FieldControl>{#snippet children(binding)}<InputRoot value={field.state.value} onValueChange={field.handleChange}><InputControl {...binding.props} onblur={field.handleBlur} /></InputRoot>{/snippet}</FieldControl></FieldRoot>{/snippet}</form.Field></Form>
```

## Props

| 组件 | 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `Form` | `form` | `AnyFormApi` | — | 是 | TanStack 实例。 |
| `Form` | `component` | `'form' \| false` | `'form'` | 否 | 无 DOM 模式。 |
| `Form` | `scrollToFirstError` | `boolean \| (ScrollIntoViewOptions & { focus?: boolean })` | `true` | 否 | 提交失败后定位并聚焦当前 form 的第一个无效控件。 |
| `FieldRoot` | `orientation` | `vertical/horizontal/responsive` | `vertical` | 否 | 方向。 |
| `FieldRoot` | 状态 props | `boolean` | `false` | 否 | required、disabled、readOnly、invalid、hasDescription、hasError。 |
| `FieldControl` | children snippet | `{ props, state }` | — | 是 | 绑定任意 control。 |

其它子路径导出 Label、RequiredIndicator、Description、Error、Group、Set、Legend、Content、Title、Separator。

## 状态与注意事项

- 默认在提交校验完成后滚动并聚焦第一个 `aria-invalid=true` 的 `FieldControl`；传 `false` 关闭。无 DOM 模式不自动定位。

## Rules 与字段联动

`form.Field` 直接支持 `rules`、`dependencies`、`validateTrigger`、`validateDebounce`、`validateFirst`。Rule 支持 `required/message/min/max/len/pattern/enum/type/whitespace/transform/validator`；底层转换为 TanStack validators。

- `initialValue` 是 TanStack 字段 `defaultValue` 的语义别名。
- 级联在源字段 change 事件中调用 `setFieldValue()`，通过 `form.Subscribe` 派生目标选项，不使用 reactive effect。
- 实例直接使用 `getFieldValue()`、`setFieldValue()`、`reset()`；长表单使用 `scrollToFirstError`；布局使用 `FieldRoot orientation`。

- TanStack 是唯一状态和校验来源；required 不隐式校验。
- 无 DOM 模式显式调用 handleSubmit；FieldControl 不增强或克隆调用方节点。
- Standard Schema 由应用按需安装并直接传 validators。
