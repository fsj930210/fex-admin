# Vue Form and Field primitives

## 用途与导入

TanStack `form.Field` 是唯一字段状态入口；`Form` 处理原生提交和 `component=false`，Field primitives 提供 DOM、样式与 ARIA。

```vue
<script setup lang="ts">
import { FieldControl, FieldError, FieldLabel, FieldRoot } from '@fex/components-vue/primitive/field'
import { Form, useForm } from '@fex/components-vue/primitive/form'
import { InputControl, InputRoot } from '@fex/components-vue/primitive/input'
const form = useForm({ defaultValues: { name: '' }, onSubmit: ({ value }) => console.log(value) })
</script>
<template><Form :form="form"><component :is="form.Field" name="name" v-slot="{ field, state }"><FieldRoot :invalid="state.meta.isTouched && !state.meta.isValid"><FieldLabel>Name</FieldLabel><FieldControl v-slot="{ props }"><InputRoot :value="state.value" @value-change="field.handleChange"><InputControl v-bind="props" @blur="field.handleBlur" /></InputRoot></FieldControl><FieldError v-if="state.meta.isTouched && !state.meta.isValid" :errors="state.meta.errors" /></FieldRoot></component><button type="submit">Submit</button></Form></template>
```

## Props

| 组件 | 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `Form` | `form` | `{ handleSubmit(): unknown }` | — | 是 | TanStack Form 实例。 |
| `Form` | `component` | `'form' \| false` | `'form'` | 否 | `false` 不输出宿主 DOM。 |
| `Form` | `scrollToFirstError` | `boolean \| (ScrollIntoViewOptions & { focus?: boolean })` | `true` | 否 | 提交失败后定位并聚焦当前 form 的第一个无效控件。 |
| `FieldRoot` | `orientation` | `vertical/horizontal/responsive` | `vertical` | 否 | 字段方向。 |
| `FieldRoot` | `required/disabled/readOnly/invalid` | `boolean` | `false` | 否 | 语义状态。 |
| `FieldRoot` | `hasDescription/hasError` | `boolean` | `false` | 否 | 控制 ARIA ID 引用。 |
| `FieldControl` | default slot | `{ props, state }` | — | 是 | 绑定任意 control。 |
| `FieldError` | `errors` | `readonly unknown[]` | — | 否 | 错误列表或默认 slot。 |

其余公开原子为 `FieldLabel`、`FieldRequiredIndicator`、`FieldDescription`、`FieldGroup`、`FieldSet`、`FieldLegend`、`FieldContent`、`FieldTitle`、`FieldSeparator`。所有 attrs 和事件透传到对应原生节点。

## 状态、校验与注意事项

- Form 事件未被取消时调用 `form.handleSubmit()`；无 DOM 模式显式调用实例提交。
- 默认在提交校验完成后滚动并聚焦第一个 `aria-invalid=true` 的 `FieldControl`；传 `false` 关闭。
- `component=false` 没有 DOM 查询边界，不自动定位错误。

## Rules 与字段联动

`form.Field` 直接支持 `rules`、`dependencies`、`validateTrigger`、`validateDebounce`、`validateFirst`。Rule 支持 `required/message/min/max/len/pattern/enum/type/whitespace/transform/validator`；依赖字段更新时自动重新校验，不需要 `watch`。
- `initialValue` 是 TanStack 字段 `defaultValue` 的语义别名。
- 级联在源字段事件中调用 `setFieldValue()`，通过 `form.Subscribe` 派生目标选项，不使用 `watch`。
- 实例直接使用 `getFieldValue()`、`setFieldValue()`、`reset()`；长表单使用 `scrollToFirstError`；布局使用 `FieldRoot orientation`。
- 不保存第二份 value/errors；受控值、校验和异步状态属于 TanStack。
- `required` 不生成校验器；Standard Schema 直接传给 TanStack。
- `FieldControl` 使用 slot props，不 clone vnode；description/error 是否渲染必须与 Root 标记一致。
