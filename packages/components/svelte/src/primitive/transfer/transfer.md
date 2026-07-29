# Transfer

`Transfer` 在两个内置 panel 之间移动有序数据，默认 body 复用 primitive Listbox。组件只提供 primitive 层。

## 导入与基础用法

```svelte
<script lang="ts">
  import Transfer from '@fex/components-svelte/primitive/transfer'
</script>

<Transfer
  items={members}
  fieldNames={{ key: 'id', label: 'name', disabled: 'disabled' }}
  defaultTargetKeys={['grace']}
  onChange={(keys, meta) => console.log(keys, meta.targetItems)}
/>
```

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `readonly TItem[]` | 必填 | 完整数据；数据引用变化会清空临时勾选。 |
| `fieldNames` | `TransferFieldNames` | 标准字段 | 映射 key、label、disabled。 |
| `targetKeys` / `defaultTargetKeys` | `readonly TransferKey[]` | — / `[]` | 受控值与非受控初始值。 |
| `checkedKeys` / `defaultCheckedKeys` | `Partial<TransferCheckedKeys>` | — / `{}` | 两侧受控与非受控勾选。 |
| `disabled` | `boolean` | `false` | 禁止勾选和所有移动。 |
| `title` | `{ source?, target? }` | Source/Target | 默认 panel 标题。 |
| `validation` | `{ status, message }` | — | error 或 warning 展示。 |

`onChange(keys, meta)` 返回完整移动 items；`onCheckedChange(keys, meta)` 返回两侧勾选与变更 items。

通过 `sourceHeader/sourceBody/sourceFooter`、`targetHeader/targetBody/targetFooter`、`item` 和 `actions` snippets 自定义区域。Panel API 提供 `items`、`checkedKeys`、`setCheckedKeys`、`isChecked` 与同一个 `controller`；actions snippet 接收 `controller, snapshot`，可直接绑定按钮禁用态。Tree/DataGrid 不需要重写移动逻辑。

受控模式必须在 `onChange` 回写 `targetKeys`。disabled item 会保留在当前 panel，并从勾选及全部移动操作中排除。
