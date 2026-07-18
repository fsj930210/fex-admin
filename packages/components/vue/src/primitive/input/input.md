# Vue Input Primitives

## 用途与导入

Input primitives 将值协议、原生输入、清空和附属内容拆开，供表单、Select、DatePicker 等组合使用。
逻辑层单独从 `@fex/components-vue/primitive/input/use-input` 引入，不经由组件入口重新导出。

```vue
<script setup lang="ts">
import { InputClear, InputControl, InputPrefix, InputRoot } from '@fex/components-vue/primitive/input'
</script>
<template><InputRoot default-value="admin"><InputPrefix>@</InputPrefix><InputControl aria-label="账号" /><InputClear /></InputRoot></template>
```

## Props

| 组件 | 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `InputRoot` | `value` | `string` | `undefined` | 否 | 受控值。 |
| `InputRoot` | `defaultValue` | `string` | `''` | 否 | 非受控初值。 |
| `InputRoot` | `disabled/readOnly/invalid` | `boolean` | `false` | 否 | 字段状态。 |
| `InputControl` | 原生 input 属性 | `InputHTMLAttributes` | `undefined` | 否 | 透传到原生 input。 |
| `InputClear` | `forceMount` | `boolean` | `false` | 否 | 无值时仍挂载。 |

## 事件、状态与组合

Root 触发 `valueChange(value, meta)` 和 `clear(meta)`；Control 保留原生 `input/focus/blur` 事件。受控模式使用 `:value` 与 `@value-change`，非受控模式使用 `default-value`。Prefix、Suffix、AddonBefore、AddonAfter 只负责原子结构；Field 仍是独立表单组件。清空在 disabled/readOnly/空值时不可用，并在成功后恢复 Control 焦点。
