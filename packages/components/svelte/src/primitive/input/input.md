# Svelte Input Primitives

## 用途与导入

```svelte
<script lang="ts">
  import InputRoot from '@fex/components-svelte/primitive/input'
  import InputControl from '@fex/components-svelte/primitive/input-control'
  import InputClear from '@fex/components-svelte/primitive/input-clear'
</script>
<InputRoot defaultValue="admin"><InputControl aria-label="账号" /><InputClear /></InputRoot>
```

## Props

| 组件 | 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `InputRoot` | `value/defaultValue` | `string` | `undefined/''` | 否 | 受控值与非受控初值。 |
| `InputRoot` | `onValueChange` | `(value, meta) => void` | `undefined` | 否 | 输入和清空回调。 |
| `InputRoot` | `disabled/readOnly/invalid` | `boolean` | `false` | 否 | 字段状态。 |
| `InputControl` | 原生 input 属性 | `HTMLInputAttributes` | `undefined` | 否 | 原生属性和事件。 |
| `InputClear` | `forceMount` | `boolean` | `false` | 否 | 无值时仍挂载。 |

Prefix、Suffix、AddonBefore、AddonAfter 分别通过对应公开子路径导入。Field 独立负责标签、说明和错误。清空遵守 disabled/readOnly，并在成功后恢复 Control 焦点。
