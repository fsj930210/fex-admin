# Transfer

`Transfer` 在两个内置 panel 之间移动有序数据，默认 body 复用 primitive Listbox。组件只提供 primitive 层。

## 导入与基础用法

```tsx
import { Transfer } from '@fex/components-solid/primitive/transfer'

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
| `panels` | `{ source?, target? }` | `{}` | 分别自定义 header/body/footer。 |
| `actions` | `(controller, snapshot) => JSX.Element` | 默认四按钮 | 自定义动作组合；snapshot 响应勾选变化。 |
| `renderItem` | `(item) => JSX.Element` | label 字段 | 自定义默认 Listbox item。 |
| `validation` | `{ status, message }` | — | error 或 warning 展示。 |

`onChange(keys, meta)` 返回完整 moved/source/target items；`onCheckedChange(keys, meta)` 返回两侧勾选及变更 items。

Panel render API 提供 `items`、`checkedKeys`、`setCheckedKeys`、`isChecked` 与同一个 `controller`。Tree/DataGrid 只绑定选择状态，移动逻辑无需重写。受控模式必须在 `onChange` 回写 `targetKeys`；disabled item 会保留在当前 panel，并从全部移动操作中过滤。
